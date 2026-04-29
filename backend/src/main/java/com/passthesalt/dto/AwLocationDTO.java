package com.passthesalt.dto;

public record AwLocationDTO(
        Long id,
        Long courseId,
        String name,
        Double lng,
        Double lat,
        Long createdByUserId,
        String createdByName,
        long voteCount,
        boolean votedByCurrentUser) {
}