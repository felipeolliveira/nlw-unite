package com.felipeolliveira.passin.controllers;

import com.felipeolliveira.passin.dtos.attendee.AttendeeDetailsDTO;
import com.felipeolliveira.passin.dtos.attendee.AttendeeIdDTO;
import com.felipeolliveira.passin.dtos.attendee.AttendeeRequestDTO;
import com.felipeolliveira.passin.dtos.event.*;
import com.felipeolliveira.passin.dtos.general.PaginationDTO;
import com.felipeolliveira.passin.services.AttendeeService;
import com.felipeolliveira.passin.services.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;

@RestController
@RequestMapping("/events")
@RequiredArgsConstructor
public class EventController {
    private final EventService eventService;
    private final AttendeeService attendeeService;

    @GetMapping("")
    public ResponseEntity<PaginationDTO<EventDetailDTO>> getAllEvents(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        PaginationDTO<EventDetailDTO> events = this.eventService.getAllEvents(PageRequest.of(page, size));
        return ResponseEntity.ok(events);
    }

    @GetMapping("/{eventId}")
    public ResponseEntity<EventGetResponseDTO> getEvent(@PathVariable String eventId) {
        EventGetResponseDTO event = this.eventService.getEventDetail(eventId);
        return ResponseEntity.ok(event);
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<EventGetResponseDTO> getEventBySlug(@PathVariable String slug) {
        EventGetResponseDTO event = this.eventService.getEventDetailBySlug(slug);
        return ResponseEntity.ok(event);
    }

    @PostMapping()
    public ResponseEntity<EventIdDTO> createEvent(@RequestBody EventCreateRequestDTO body, UriComponentsBuilder uriComponentsBuilder){
        EventIdDTO eventIdDto = this.eventService.createEvent(body);
        URI uri = uriComponentsBuilder.path("/events/{attendeeId}").buildAndExpand(eventIdDto.id()).toUri();
        return ResponseEntity.created(uri).body(eventIdDto);
    }

    @GetMapping("/{eventId}/attendees")
    public ResponseEntity<PaginationDTO<AttendeeDetailsDTO>> getEventAttendees(
            @PathVariable String eventId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false, name="search") String attendeeNameSearchText
    ){
        PaginationDTO<AttendeeDetailsDTO> attendees = this.attendeeService.getEventAttendees(eventId, PageRequest.of(page, size), attendeeNameSearchText);
        return ResponseEntity.ok(attendees);
    }

    @PostMapping("/{eventId}/attendees")
    public ResponseEntity<AttendeeIdDTO> registerParticipant(@PathVariable String eventId, @RequestBody AttendeeRequestDTO body, UriComponentsBuilder uriComponentsBuilder) {
        AttendeeIdDTO attendeeIdDTO = this.eventService.registerAttendeeOnEvent(eventId, body);
        URI uri = uriComponentsBuilder.path("/attendees/{attendeeId}/badge").buildAndExpand(attendeeIdDTO.attendeeId()).toUri();
        return ResponseEntity.created(uri).body(attendeeIdDTO);
    }
}
