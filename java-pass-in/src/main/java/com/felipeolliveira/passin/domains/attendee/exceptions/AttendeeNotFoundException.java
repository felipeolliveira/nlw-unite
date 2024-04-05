package com.felipeolliveira.passin.domains.attendee.exceptions;

public class AttendeeNotFoundException extends RuntimeException{
    public AttendeeNotFoundException(String message) {
        super(message);
    }
}
