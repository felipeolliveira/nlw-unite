package com.felipeolliveira.passin.domains.event;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "events_image")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class EventsImage {
    @Id
    @Column(nullable = false)
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @OneToOne()
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @Column(name = "image_url", nullable = false)
    private String imageUrl;
}
