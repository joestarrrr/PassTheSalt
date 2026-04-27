package com.passthesalt.service;

import com.passthesalt.dto.CreateMobGroupDTO;
import com.passthesalt.dto.AssignUserToMobGroupDTO;
import com.passthesalt.dto.AssignUserToCourseDTO;
import com.passthesalt.dto.CourseDayDTO;
import com.passthesalt.dto.MobGroupOptionDTO;
import com.passthesalt.dto.UserCourseContextDTO;
import com.passthesalt.dto.UserSummaryDTO;
import com.passthesalt.model.Course;
import com.passthesalt.model.User;
import com.passthesalt.model.MobGroup;
import com.passthesalt.repository.CourseDayRepository;
import com.passthesalt.repository.CourseRepository;
import com.passthesalt.repository.UserRepository;
import com.passthesalt.repository.MobGroupRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UserAssignmentService {
    private final UserRepository userRepository;
    private final MobGroupRepository mobGroupRepository;
    private final CourseRepository courseRepository;
    private final CourseDayRepository courseDayRepository;

    public UserAssignmentService(
            UserRepository userRepository,
            MobGroupRepository mobGroupRepository,
            CourseRepository courseRepository,
            CourseDayRepository courseDayRepository) {
        this.userRepository = userRepository;
        this.mobGroupRepository = mobGroupRepository;
        this.courseRepository = courseRepository;
        this.courseDayRepository = courseDayRepository;
    }

    @Transactional
    public void assignUserToCourse(AssignUserToCourseDTO dto) {
        User user = userRepository.findById(dto.userId())
                .orElseThrow(() -> new RuntimeException("User not found with id: " + dto.userId()));
        user.setCourseId(dto.courseId());
        userRepository.save(user);
    }

    @Transactional
    public void assignUserToMobGroup(AssignUserToMobGroupDTO dto) {
        User user = userRepository.findById(dto.userId())
                .orElseThrow(() -> new RuntimeException("User not found with id: " + dto.userId()));

        MobGroup mobGroup = mobGroupRepository.findById(dto.mobGroupId())
                .orElseThrow(() -> new RuntimeException("Mob group not found with id: " + dto.mobGroupId()));

        // Ensure user is in the same course as the mob group
        if (!user.getCourseId().equals(mobGroup.getCourseId())) {
            throw new RuntimeException("User and mob group must be in the same course");
        }

        user.setMobGroupId(dto.mobGroupId());
        userRepository.save(user);
    }

    @Transactional
    public void createMobGroup(CreateMobGroupDTO dto) {
        MobGroup mobGroup = new MobGroup(dto.courseId(), dto.name(), dto.description());
        mobGroupRepository.save(mobGroup);
    }

    public List<MobGroupOptionDTO> getMobGroupsForCourse(Long courseId) {
        return mobGroupRepository.findByCourseId(courseId)
                .stream()
                .map(mobGroup -> new MobGroupOptionDTO(
                        mobGroup.getId(),
                        mobGroup.getCourseId(),
                        mobGroup.getName(),
                        mobGroup.getDescription()))
                .toList();
    }

    public List<UserSummaryDTO> getUsers(Long courseId) {
        List<User> users = courseId == null ? userRepository.findAll() : userRepository.findByCourseId(courseId);
        return users.stream()
                .map(user -> new UserSummaryDTO(
                        user.getId(),
                        user.getEmail(),
                        user.getFullName(),
                        user.getRole(),
                        user.getCourseId(),
                        user.getMobGroupId()))
                .toList();
    }

    public UserCourseContextDTO getUserCourseContext(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        if (user.getCourseId() == null) {
            throw new RuntimeException("User is not assigned to a course");
        }

        Course course = courseRepository.findById(user.getCourseId())
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + user.getCourseId()));

        MobGroup mobGroup = null;
        if (user.getMobGroupId() != null) {
            mobGroup = mobGroupRepository.findById(user.getMobGroupId())
                    .orElseThrow(() -> new RuntimeException("Mob group not found with id: " + user.getMobGroupId()));
        }

        List<CourseDayDTO> courseDays = courseDayRepository.findByCourseIdOrderByDayNumber(course.getId())
                .stream()
                .map(day -> new CourseDayDTO(day.getId(), day.getCourseId(), day.getDayNumber(), day.getDate()))
                .toList();

        return new UserCourseContextDTO(
                user.getId(),
                course.getId(),
                course.getName(),
                mobGroup != null ? mobGroup.getId() : null,
                mobGroup != null ? mobGroup.getName() : null,
                courseDays);
    }
}
