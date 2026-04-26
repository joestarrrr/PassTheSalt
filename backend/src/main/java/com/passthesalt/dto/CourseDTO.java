package com.passthesalt.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record CourseDTO(
        Long id,
        @NotBlank(message = "Course name is required") String name,
        @NotNull(message = "Number of days is required") Integer numberOfDays,
        @NotNull(message = "Start date is required") LocalDate startDate) {
}
