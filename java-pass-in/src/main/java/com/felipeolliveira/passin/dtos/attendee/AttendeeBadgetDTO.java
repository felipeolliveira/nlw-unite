package com.felipeolliveira.passin.dtos.attendee;

public record AttendeeBadgetDTO(
        String name,
        String email,
        String checkInUrl,
        String eventId
){}
