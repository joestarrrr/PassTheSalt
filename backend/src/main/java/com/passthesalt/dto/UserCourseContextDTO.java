package com.passthesalt.dto;

import java.util.List;

public record UserCourseContextDTO(
        Long userId,
        Long courseId,
        String courseName,
        Long mobGroupId,
        String mobGroupName,
        List<CourseDayDTO> courseDays) {
}
