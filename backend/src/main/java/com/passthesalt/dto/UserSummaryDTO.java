package com.passthesalt.dto;

public record UserSummaryDTO(
        Long id,
        String email,
        String fullName,
        String role,
        Long courseId,
        Long mobGroupId) {
}
