package com.passthesalt.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record UserDTO(Long eventId, @NotBlank(message = "title is required") String title,
        @NotBlank(message = "location is required") String location,
        @NotNull(message = "eventDate is required") LocalDate eventDate,
        @NotNull(message = "createdByUserId is required") Long createdByUserId) {
}

