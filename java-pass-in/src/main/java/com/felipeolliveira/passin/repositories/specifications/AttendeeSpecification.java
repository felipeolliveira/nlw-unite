package com.felipeolliveira.passin.repositories.specifications;

import com.felipeolliveira.passin.domains.attendee.Attendee;
import com.felipeolliveira.passin.domains.event.Event;
import jakarta.persistence.criteria.Join;
import org.springframework.data.jpa.domain.Specification;

public class AttendeeSpecification {

    private AttendeeSpecification() {
    }

    public static Specification<Attendee> searchByName(String name) {
        String parsedName = name.replaceAll("\\s", "").toLowerCase();
        return (root, query, builder) -> builder.like(
                builder.function("REPLACE", String.class, builder.lower(root.get("name")), builder.literal(" "), builder.literal("")),
                "%" + parsedName + "%"
        );
    }

    public static Specification<Attendee> byEventId(String eventId) {
        return (root, query, builder) -> {
            Join<Event, Attendee> eventAttendee = root.join("event");
            return builder.equal(eventAttendee.get("id"), eventId);
        };
    }
}
