package com.passthesalt.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateAwLocationDTO(
        @NotNull(message = "courseId is required") Long courseId,
        @NotBlank(message = "name is required") String name,
        @NotNull(message = "lng is required") Double lng,
        @NotNull(message = "lat is required") Double lat) {
}