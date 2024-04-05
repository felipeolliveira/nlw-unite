package com.felipeolliveira.passin.services;

import com.felipeolliveira.passin.domains.attendee.Attendee;
import com.felipeolliveira.passin.domains.checkin.CheckIn;
import com.felipeolliveira.passin.domains.checkin.exceptions.CheckinAlreadyExistsException;
import com.felipeolliveira.passin.repositories.CheckInRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CheckInService {
    private final CheckInRepository checkInRepository;

    public void registerCheckInAttendee(Attendee attendee) {
        this._verifyCheckInExists(attendee.getId());

        CheckIn newCheckIn = new CheckIn();
        newCheckIn.setAttendee(attendee);
        newCheckIn.setCreatedAt(LocalDateTime.now());

        this.checkInRepository.save(newCheckIn);
    }

    private void _verifyCheckInExists(String attendeeId) {
        Optional<CheckIn> isCheckedIn = this.getCheckIn(attendeeId);
        if (isCheckedIn.isPresent()) {
            throw new CheckinAlreadyExistsException("Attendee already checked in");
        }
    }

    public Optional<CheckIn> getCheckIn(String attendeeId) {
        return this.checkInRepository.findByAttendeeId(attendeeId);
    }
}
