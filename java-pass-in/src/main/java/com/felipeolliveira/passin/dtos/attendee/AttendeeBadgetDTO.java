package com.felipeolliveira.passin.dtos.attendee;

public record AttendeeBadgetDTO(
        String name,
        String email,

        String ticketCode,
        String checkInUrl,
        String eventId
){}
