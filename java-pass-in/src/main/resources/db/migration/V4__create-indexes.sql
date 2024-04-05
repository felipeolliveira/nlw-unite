CREATE UNIQUE INDEX events_slug_idx ON events (slug);
CREATE UNIQUE INDEX attendees_event_id_email_idx ON attendees (event_id, email);
CREATE UNIQUE INDEX check_ins_attendee_id_idx ON check_ins (attendee_id);