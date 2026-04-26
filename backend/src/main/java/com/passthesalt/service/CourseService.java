package com.passthesalt.service;

import com.passthesalt.dto.CourseDTO;
import com.passthesalt.dto.CourseDayDTO;
import com.passthesalt.model.Course;
import com.passthesalt.model.CourseDay;
import com.passthesalt.repository.CourseRepository;
import com.passthesalt.repository.CourseDayRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CourseService {
    private final CourseRepository courseRepository;
    private final CourseDayRepository courseDayRepository;

    public CourseService(CourseRepository courseRepository, CourseDayRepository courseDayRepository) {
        this.courseRepository = courseRepository;
        this.courseDayRepository = courseDayRepository;
    }

    @Transactional
    public CourseDTO createCourse(CourseDTO courseDTO) {
        Course course = new Course(courseDTO.name(), courseDTO.numberOfDays(), courseDTO.startDate());
        Course savedCourse = courseRepository.save(course);

        // Generate course days
        LocalDate currentDate = courseDTO.startDate();
        for (int i = 1; i <= courseDTO.numberOfDays(); i++) {
            CourseDay courseDay = new CourseDay(savedCourse.getId(), i, currentDate);
            courseDayRepository.save(courseDay);
            currentDate = currentDate.plusDays(1);
        }

        return new CourseDTO(savedCourse.getId(), savedCourse.getName(), savedCourse.getNumberOfDays(),
                savedCourse.getStartDate());
    }

    public CourseDTO getCourseById(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + id));
        return new CourseDTO(course.getId(), course.getName(), course.getNumberOfDays(), course.getStartDate());
    }

    public List<CourseDTO> getAllCourses() {
        return courseRepository.findAll()
                .stream()
                .map(course -> new CourseDTO(course.getId(), course.getName(), course.getNumberOfDays(),
                        course.getStartDate()))
                .collect(Collectors.toList());
    }

    public List<CourseDayDTO> getCourseDaysByCourse(Long courseId) {
        return courseDayRepository.findByCourseIdOrderByDayNumber(courseId)
                .stream()
                .map(day -> new CourseDayDTO(day.getId(), day.getCourseId(), day.getDayNumber(), day.getDate()))
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteCourse(Long courseId) {
        courseRepository.deleteById(courseId);
    }
}
