package com.felipeolliveira.passin.dtos.event;

public record EventDetailDTO(
        String id,
        String title,
        String details,
        String slug,

        String imageUrl,
        Integer maximumAttendees,
        Integer attendeesAmount
){}
