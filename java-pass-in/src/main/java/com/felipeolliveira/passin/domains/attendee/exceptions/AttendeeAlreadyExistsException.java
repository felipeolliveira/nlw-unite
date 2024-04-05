package com.felipeolliveira.passin.domains.attendee.exceptions;

public class AttendeeAlreadyExistsException extends RuntimeException {
    public AttendeeAlreadyExistsException(String message) {
        super(message);
    };
}
