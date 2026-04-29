package com.passthesalt.dto;

public record CurrentUserDTO(
        Long id,
        String email,
        String fullName,
        String role,
        Long courseId,
        Long mobGroupId) {
}
