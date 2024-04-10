package com.felipeolliveira.passin.services;

import com.felipeolliveira.passin.domains.attendee.Attendee;
import com.felipeolliveira.passin.domains.attendee.exceptions.AttendeeAlreadyExistsException;
import com.felipeolliveira.passin.domains.attendee.exceptions.AttendeeNotFoundException;
import com.felipeolliveira.passin.domains.checkin.CheckIn;
import com.felipeolliveira.passin.dtos.attendee.AttendeeBadgeResponseDTO;
import com.felipeolliveira.passin.dtos.attendee.AttendeeBadgetDTO;
import com.felipeolliveira.passin.dtos.attendee.AttendeeDetailsDTO;
import com.felipeolliveira.passin.dtos.general.PaginationDTO;
import com.felipeolliveira.passin.repositories.AttendeeRepository;
import io.micrometer.common.util.StringUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.web.util.UriComponentsBuilder;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

import com.felipeolliveira.passin.repositories.specifications.AttendeeSpecification;

@Service
@RequiredArgsConstructor
public class AttendeeService {
    private final AttendeeRepository attendeeRepository;
    private final CheckInService checkInService;

    public List<Attendee> getAllAttendeesFromEventId(String eventId) {
        return this.attendeeRepository.findByEventId(eventId);
    }

    public PaginationDTO<AttendeeDetailsDTO> getEventAttendees(String eventId, Pageable pageableParams, String attendeeName) {
        Specification<Attendee> filters = Specification
                .where(StringUtils.isBlank(attendeeName) ? null : AttendeeSpecification.searchByName(attendeeName))
                .and(AttendeeSpecification.byEventId(eventId));
        Page<Attendee> attendeeListPage = this.attendeeRepository.findAll(filters, pageableParams);

        List<AttendeeDetailsDTO> attendeeDetailsList = attendeeListPage.getContent().stream().map(attendee -> {
            Optional<CheckIn> checkIn = this.checkInService.getCheckIn(attendee.getId());

            LocalDateTime checkedInAt = checkIn.map(CheckIn::getCreatedAt).orElse(null);
            return new AttendeeDetailsDTO(
                    attendee.getId(),
                    attendee.getName(),
                    attendee.getEmail(),
                    attendee.getTicketCode(),
                    attendee.getCreatedAt().format(DateTimeFormatter.ISO_DATE_TIME),
                    checkedInAt == null ? null : checkedInAt.format(DateTimeFormatter.ISO_DATE_TIME)
            );
        }).toList();

        return new PaginationDTO<AttendeeDetailsDTO>("attendees", attendeeDetailsList, attendeeListPage.getTotalElements(), attendeeListPage.getTotalPages(), attendeeListPage.getNumber());
    }

    public void registerAttendee(Attendee newAttendee) {
        this.attendeeRepository.save(newAttendee);
    }

    public void verifyAttendeeSubscription(String eventId, String email) {
        Optional<Attendee> isAttendeeRegistered = this.attendeeRepository.findByEventIdAndEmail(eventId, email);
        if (isAttendeeRegistered.isPresent()) {
            throw new AttendeeAlreadyExistsException("Attendee already registered on this event");
        }
    }

    public AttendeeBadgeResponseDTO getAttendeeBadge(String attendeeId, UriComponentsBuilder uriComponentsBuilder) {
        Attendee attendee = this._getAttendeeById(attendeeId);

        var uri = uriComponentsBuilder.path("/attendees/{attendeeId}/check-in").buildAndExpand(attendeeId).toUri().toString();

        AttendeeBadgetDTO badge = new AttendeeBadgetDTO(attendee.getName(), attendee.getEmail(), attendee.getTicketCode(), uri, attendee.getEvent().getId());

        return new AttendeeBadgeResponseDTO(badge);
    }

    public void checkinAttendee(String attendeeId) {
        Attendee attendee = this._getAttendeeById(attendeeId);
        this.checkInService.registerCheckInAttendee(attendee);
    }

    private Attendee _getAttendeeById(String attendeeId) {
        return this.attendeeRepository.findById(attendeeId).orElseThrow(() -> new AttendeeNotFoundException("Attendee not found"));
    }

    private Attendee _getAttendeeByTicketCode(String ticketCode) {
        return this.attendeeRepository.findByTicketCode(ticketCode).orElseThrow(() -> new AttendeeNotFoundException("Attendee not found"));
    }

    public AttendeeBadgeResponseDTO getAttendeeBadgeByTicketCode(String ticketCode, UriComponentsBuilder uriBuilder) {
        Attendee attendee = this._getAttendeeByTicketCode(ticketCode.toUpperCase());

        var uri = uriBuilder.path("/attendees/{attendeeId}/check-in").buildAndExpand(attendee.getId()).toUri().toString();

        AttendeeBadgetDTO badge = new AttendeeBadgetDTO(attendee.getName(), attendee.getEmail(), attendee.getTicketCode(), uri, attendee.getEvent().getId());

        return new AttendeeBadgeResponseDTO(badge);
    }
}

