package com.felipeolliveira.passin.repositories;

import com.felipeolliveira.passin.domains.event.EventsImage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EventsImageRepository extends JpaRepository<EventsImage, String>{
    Optional<EventsImage> findByEventId(String eventId);
}
