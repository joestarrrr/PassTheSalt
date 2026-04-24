package com.passthesalt.model;

import java.time.LocalDateTime;

public record MobGroupFormSubmission(Long id, Long mobGroupId, Long submittedByUserId, String formContent,
        LocalDateTime submittedAt) {
}

