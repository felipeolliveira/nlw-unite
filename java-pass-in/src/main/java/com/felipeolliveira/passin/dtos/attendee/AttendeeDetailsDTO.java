package com.felipeolliveira.passin.dtos.attendee;

import java.time.LocalDateTime;

public record AttendeeDetailsDTO(
        String id,
        String name,
        String email,
        String createdAt,
        String checkedInAt
) {}
