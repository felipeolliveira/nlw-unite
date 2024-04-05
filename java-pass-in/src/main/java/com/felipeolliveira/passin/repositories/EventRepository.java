package com.felipeolliveira.passin.repositories;

import com.felipeolliveira.passin.domains.event.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;

public interface EventRepository extends JpaRepository<Event, String> {
    Optional<Event> findBySlug(String slug);
}
