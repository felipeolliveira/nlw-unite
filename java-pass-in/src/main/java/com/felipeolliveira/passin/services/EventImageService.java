package com.felipeolliveira.passin.services;

import com.felipeolliveira.passin.domains.event.Event;
import com.felipeolliveira.passin.domains.event.EventsImage;
import com.felipeolliveira.passin.repositories.EventsImageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class EventImageService {
    private final EventsImageRepository eventsImageRepository;

    public Optional<EventsImage> getImageFromEventId(String eventId) {
        return this.eventsImageRepository.findByEventId(eventId);
    }

    public void saveImage(Event event, String path) {
        var image = new EventsImage();
        image.setImageUrl(path);
        image.setEvent(event);

        this.eventsImageRepository.save(image);
    }
}
