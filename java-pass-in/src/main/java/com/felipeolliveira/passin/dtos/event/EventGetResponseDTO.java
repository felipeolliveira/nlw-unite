package com.felipeolliveira.passin.dtos.event;

import com.felipeolliveira.passin.domains.event.Event;
import lombok.Getter;

@Getter
public class EventGetResponseDTO {
    EventDetailDTO event;
    public EventGetResponseDTO(Event event, Integer numberOfAttendees) {
        this.event = new EventDetailDTO(event.getId(), event.getTitle(), event.getDetails(), event.getSlug(), event.getMaximumAttendees(), numberOfAttendees);
    }
}
