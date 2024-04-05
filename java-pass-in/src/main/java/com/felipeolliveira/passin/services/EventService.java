package com.felipeolliveira.passin.services;

import com.felipeolliveira.passin.domains.attendee.Attendee;
import com.felipeolliveira.passin.domains.event.Event;
import com.felipeolliveira.passin.domains.event.exceptions.EventFullException;
import com.felipeolliveira.passin.domains.event.exceptions.EventNotFountException;
import com.felipeolliveira.passin.dtos.attendee.AttendeeIdDTO;
import com.felipeolliveira.passin.dtos.attendee.AttendeeRequestDTO;
import com.felipeolliveira.passin.dtos.event.*;
import com.felipeolliveira.passin.dtos.general.PaginationDTO;
import com.felipeolliveira.passin.repositories.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.text.Normalizer;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EventService {
    private final EventRepository eventRepository;
    private final AttendeeService attendeeService;

    public EventGetResponseDTO getEventDetail(String eventId) {
        Event event = _getEventById(eventId);
        List<Attendee> attendeeList = this.attendeeService.getAllAttendeesFromEventId(eventId);
        return new EventGetResponseDTO(event, attendeeList.size());
    }

    public EventGetResponseDTO getEventDetailBySlug(String slug) {
        Event event = _getEventBySlug(slug);
        List<Attendee> attendeeList = this.attendeeService.getAllAttendeesFromEventId(event.getId());
        return new EventGetResponseDTO(event, attendeeList.size());
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

        Attendee newAttendee = new Attendee();
        newAttendee.setName(attendeeRequestDTO.name());
        newAttendee.setEmail(attendeeRequestDTO.email());
        newAttendee.setEvent(event);
        newAttendee.setCreatedAt(LocalDateTime.now());
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
}
