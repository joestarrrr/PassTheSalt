package com.passthesalt.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateMobGroupDTO(
        @NotNull(message = "Course ID is required") Long courseId,
        @NotBlank(message = "Mob group name is required") String name,
        String description) {
}
