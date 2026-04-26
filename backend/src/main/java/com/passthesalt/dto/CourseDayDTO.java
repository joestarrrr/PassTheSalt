package com.passthesalt.dto;

import java.time.LocalDate;

public record CourseDayDTO(
        Long id,
        Long courseId,
        Integer dayNumber,
        LocalDate date) {
}
