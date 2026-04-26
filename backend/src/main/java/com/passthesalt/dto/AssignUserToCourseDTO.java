package com.passthesalt.dto;

import jakarta.validation.constraints.NotNull;

public record AssignUserToCourseDTO(
        @NotNull(message = "User ID is required") Long userId,
        @NotNull(message = "Course ID is required") Long courseId) {
}
