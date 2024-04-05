package com.felipeolliveira.passin.domains.checkin.exceptions;

public class CheckinAlreadyExistsException extends RuntimeException {
    public CheckinAlreadyExistsException(String message) {
        super(message);
    }
}
