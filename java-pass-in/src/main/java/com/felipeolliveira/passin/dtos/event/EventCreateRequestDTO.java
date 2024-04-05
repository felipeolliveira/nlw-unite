package com.felipeolliveira.passin.dtos.event;

public record EventCreateRequestDTO(
        String title,
        String details,
        Integer maximumAttendees
){}
