package com.felipeolliveira.passin.config;

import com.felipeolliveira.passin.domains.attendee.exceptions.AttendeeAlreadyExistsException;
import com.felipeolliveira.passin.domains.attendee.exceptions.AttendeeNotFoundException;
import com.felipeolliveira.passin.domains.checkin.exceptions.CheckinAlreadyExistsException;
import com.felipeolliveira.passin.domains.event.exceptions.EventFullException;
import com.felipeolliveira.passin.domains.event.exceptions.EventImageNotPossibletoUploadException;
import com.felipeolliveira.passin.domains.event.exceptions.EventImageNotSupportExtensionException;
import com.felipeolliveira.passin.domains.event.exceptions.EventNotFountException;
import com.felipeolliveira.passin.dtos.general.ErrorResponseDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class ExceptionEntityHandler {
    @ExceptionHandler(EventNotFountException.class)
    public ResponseEntity<Object> handleEventNotFound(EventNotFountException exception) {
        return ResponseEntity.notFound().build();
    }

    @ExceptionHandler(AttendeeNotFoundException.class)
    public ResponseEntity<Object> handleAttendeeNotFound(AttendeeNotFoundException exception) {
        return ResponseEntity.notFound().build();
    }

    @ExceptionHandler(AttendeeAlreadyExistsException.class)
    public ResponseEntity<Object> handleAttendeeAttendeeAlreadyExists(AttendeeAlreadyExistsException exception) {
        return ResponseEntity.status(HttpStatus.CONFLICT).build();
    }

    @ExceptionHandler(CheckinAlreadyExistsException.class)
    public ResponseEntity<Object> handleCheckinAlreadyExists(CheckinAlreadyExistsException exception) {
        return ResponseEntity.status(HttpStatus.CONFLICT).build();
    }

    @ExceptionHandler(EventImageNotPossibletoUploadException.class)
    public ResponseEntity<Object> handleNotPossibleUploadEventImage(EventImageNotPossibletoUploadException exception) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }

    @ExceptionHandler(EventImageNotSupportExtensionException.class)
    public ResponseEntity<Object> handleImageNotSupportMediaType(EventImageNotSupportExtensionException exception) {
        return ResponseEntity.status(HttpStatus.UNSUPPORTED_MEDIA_TYPE).body(new ErrorResponseDTO(exception.getMessage()));
    }

    @ExceptionHandler(EventFullException.class)
    public ResponseEntity<ErrorResponseDTO> handleEventFullExceptions(EventFullException exception) {
        return ResponseEntity.badRequest().body(new ErrorResponseDTO(exception.getMessage()));
    }
}

