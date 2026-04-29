package com.passthesalt.dto;

import jakarta.validation.constraints.NotBlank;

public record UpdateAwLocationDTO(
        @NotBlank(message = "name is required") String name) {
}