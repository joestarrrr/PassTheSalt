package com.passthesalt.dto;

import jakarta.validation.constraints.*;
import java.time.LocalDate;

public record RetroDTO(
        Long id,
        @NotNull(message = "Course ID is required") Long courseId,
        @NotNull(message = "Course day ID is required") Long courseDayId,
        @NotNull(message = "Mob group ID is required") Long mobGroupId,
        @NotNull(message = "User ID is required") Long userId,
        @NotBlank(message = "Start of day is required") String startOfDay,
        String workedWell,
        String learned,
        String improve,
        @NotNull(message = "Submission date is required") LocalDate submissionDate,
        @Min(value = 1, message = "Rating must be between 1 and 5") @Max(value = 5, message = "Rating must be between 1 and 5") Integer rating,
        String lectureName) {
}
