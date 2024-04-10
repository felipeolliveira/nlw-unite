package com.felipeolliveira.passin.dtos.event;

import com.felipeolliveira.passin.domains.event.Event;
import com.felipeolliveira.passin.domains.event.EventsImage;
import lombok.Getter;

@Getter
public class EventGetResponseDTO {
    EventDetailDTO event;
    public EventGetResponseDTO(Event event, Integer numberOfAttendees, EventsImage image) {
        this.event = new EventDetailDTO(
                event.getId(),
                event.getTitle(),
                event.getDetails(),
                event.getSlug(),
                image.getImageUrl(),
                event.getMaximumAttendees(),
                numberOfAttendees
        );
    }
}
