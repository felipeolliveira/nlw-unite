CREATE TABLE events_image (
    id VARCHAR(255) NOT NULL PRIMARY KEY,
    event_id VARCHAR(255) NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT events_images_id_fk
        FOREIGN KEY (event_id) REFERENCES events (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE UNIQUE INDEX event_image_idx ON events_image (event_id);