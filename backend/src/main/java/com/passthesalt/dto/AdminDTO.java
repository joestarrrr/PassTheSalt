package com.passthesalt.dto;

import jakarta.validation.constraints.NotBlank;

public record AdminDTO(Long mobGroupId, Long userId, @NotBlank(message = "mobGroupName is required") String mobGroupName) {
}

