package com.passthesalt.dto;

import jakarta.validation.constraints.NotNull;

public record AssignUserToMobGroupDTO(
        @NotNull(message = "User ID is required") Long userId,
        @NotNull(message = "Mob group ID is required") Long mobGroupId) {
}
