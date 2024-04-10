package com.felipeolliveira.passin.dtos.attendee;

import java.time.LocalDateTime;

public record AttendeeDetailsDTO(
        String id,
        String name,
        String email,

        String ticketCode,
        String createdAt,
        String checkedInAt
) {}
