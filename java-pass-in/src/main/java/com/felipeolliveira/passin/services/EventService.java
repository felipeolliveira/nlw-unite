package com.felipeolliveira.passin.services;

import com.felipeolliveira.passin.domains.attendee.Attendee;
import com.felipeolliveira.passin.domains.event.Event;
import com.felipeolliveira.passin.domains.event.EventsImage;
import com.felipeolliveira.passin.domains.event.exceptions.EventFullException;
import com.felipeolliveira.passin.domains.event.exceptions.EventImageNotPossibletoUploadException;
import com.felipeolliveira.passin.domains.event.exceptions.EventImageNotSupportExtensionException;
import com.felipeolliveira.passin.domains.event.exceptions.EventNotFountException;
import com.felipeolliveira.passin.dtos.attendee.AttendeeIdDTO;
import com.felipeolliveira.passin.dtos.attendee.AttendeeRequestDTO;
import com.felipeolliveira.passin.dtos.event.*;
import com.felipeolliveira.passin.dtos.general.PaginationDTO;
import com.felipeolliveira.passin.repositories.EventRepository;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.Normalizer;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class EventService {
    private final EventRepository eventRepository;
    private final AttendeeService attendeeService;
    private final EventImageService eventImageService;

    public EventGetResponseDTO getEventDetail(String eventId) {
        Event event = _getEventById(eventId);
        List<Attendee> attendeeList = this.attendeeService.getAllAttendeesFromEventId(eventId);
        EventsImage eventsImage = this.eventImageService.getImageFromEventId(eventId).orElse(new EventsImage());
        return new EventGetResponseDTO(event, attendeeList.size(), eventsImage);
    }

    public EventGetResponseDTO getEventDetailBySlug(String slug) {
        Event event = _getEventBySlug(slug);
        List<Attendee> attendeeList = this.attendeeService.getAllAttendeesFromEventId(event.getId());
        EventsImage eventsImage = this.eventImageService.getImageFromEventId(event.getId()).orElse(new EventsImage());
        return new EventGetResponseDTO(event, attendeeList.size(), eventsImage);
    }

    public EventIdDTO createEvent(EventCreateRequestDTO eventCreateRequestDTO) {
        Event newEvent = new Event();
        newEvent.setTitle(eventCreateRequestDTO.title());
        newEvent.setDetails(eventCreateRequestDTO.details());
        newEvent.setMaximumAttendees(eventCreateRequestDTO.maximumAttendees());
        newEvent.setSlug(this._generateSlug(eventCreateRequestDTO.title()));

        this.eventRepository.save(newEvent);

        return new EventIdDTO(newEvent.getId());
    }

    public AttendeeIdDTO registerAttendeeOnEvent(String eventId, AttendeeRequestDTO attendeeRequestDTO) {
        this.attendeeService.verifyAttendeeSubscription(eventId, attendeeRequestDTO.email());

        Event event = _getEventById(eventId);
        List<Attendee> attendeeList = this.attendeeService.getAllAttendeesFromEventId(eventId);

        if(event.getMaximumAttendees() <= attendeeList.size()) {
            throw new EventFullException("Event is full");
        }

        String newTicketCode = RandomStringUtils.randomAlphanumeric(8).toUpperCase();

        Attendee newAttendee = new Attendee();
        newAttendee.setName(attendeeRequestDTO.name());
        newAttendee.setEmail(attendeeRequestDTO.email());
        newAttendee.setEvent(event);
        newAttendee.setCreatedAt(LocalDateTime.now());
        newAttendee.setTicketCode(newTicketCode);
        this.attendeeService.registerAttendee(newAttendee);

        return new AttendeeIdDTO(newAttendee.getId());
    }

    public PaginationDTO<EventDetailDTO> getAllEvents(Pageable pageable) {
        Page<Event> events = this.eventRepository.findAll(pageable);

        List<EventDetailDTO> eventsDetails = events.getContent().stream().map(event -> {
            EventGetResponseDTO eventDetail = this.getEventDetail(event.getId());
            return eventDetail.getEvent();
        }).toList();

        return new PaginationDTO<EventDetailDTO>("events", eventsDetails, events.getTotalElements(), events.getTotalPages(), events.getNumber());
    }

    private Event _getEventById(String eventId) {
        return this.eventRepository.findById(eventId).orElseThrow(() -> new EventNotFountException("Event not found with attendeeId: " + eventId));
    }

    private Event _getEventBySlug(String slug) {
        return this.eventRepository.findBySlug(slug).orElseThrow(() -> new EventNotFountException("Event not found with slug: " + slug));
    }

    private String _generateSlug(String text) {
        String normalized = Normalizer.normalize(text, Normalizer.Form.NFD);
        return text
                .trim()
                .replaceAll("[\\p{InCOMBINING_DIACRITICAL_MARKS}]", "")
                .replaceAll("[^\\w\\s]", "")
                .replaceAll("\\s+", "-")
                .toLowerCase();
    }

    public void uploadEventImageToLocal(String eventId, MultipartFile multipartFile) {
        Event event = _getEventById(eventId);
        Optional<EventsImage> eventsImage = this.eventImageService.getImageFromEventId(eventId);
        var path = _saveImageToLocal(event.getSlug(), multipartFile);

        if(eventsImage.isEmpty()) {
            this.eventImageService.saveImage(event, path);
        }
    }

    private String _saveImageToLocal(String eventSlug, MultipartFile multipartFile) {
        String contentType = multipartFile.getContentType();
        List<String> allowedContentTypes = List.of("image/png", "image/jpeg", "image/jpg");

        if(!allowedContentTypes.contains(contentType)) {
            throw new EventImageNotSupportExtensionException("Media type is not supported. Only PNG and JPEG are allowed.");
        }

        String dir = System.getProperty("user.dir");
        String ext = Objects.requireNonNull(multipartFile.getOriginalFilename()).split("\\.")[1];
        String newFileName = eventSlug + "." + ext;
        String staticFolderName = "events_images";
        Path completePath = Paths.get(dir, "src", "main", "resources", "static", staticFolderName, newFileName);

        try {
            if(!Files.isDirectory(completePath.getParent())) {
                Files.createDirectories(completePath.getParent());
            }

            multipartFile.transferTo(completePath);
            return Paths.get(staticFolderName, newFileName).toString();
        } catch (IOException e) {
            throw new EventImageNotPossibletoUploadException("Error on upload image");
        }
    }
}
