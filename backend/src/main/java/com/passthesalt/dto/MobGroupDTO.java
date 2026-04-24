package com.passthesalt.dto;

import java.time.LocalDateTime;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record MobGroupDTO(Long submissionId, @NotNull(message = "mobGroupId is required") Long mobGroupId,
        @NotNull(message = "submittedByUserId is required") Long submittedByUserId,
        @NotBlank(message = "formContent is required") String formContent, LocalDateTime submittedAt) {
}

