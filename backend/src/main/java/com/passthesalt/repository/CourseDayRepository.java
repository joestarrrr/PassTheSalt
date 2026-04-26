package com.passthesalt.repository;

import com.passthesalt.model.CourseDay;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseDayRepository extends JpaRepository<CourseDay, Long> {
    List<CourseDay> findByCourseIdOrderByDayNumber(Long courseId);
}
