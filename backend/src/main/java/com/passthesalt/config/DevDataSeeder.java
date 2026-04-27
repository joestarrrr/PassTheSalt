package com.passthesalt.config;

import java.time.LocalDate;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.passthesalt.model.Course;
import com.passthesalt.model.CourseDay;
import com.passthesalt.model.MobGroup;
import com.passthesalt.model.User;
import com.passthesalt.repository.CourseDayRepository;
import com.passthesalt.repository.CourseRepository;
import com.passthesalt.repository.MobGroupRepository;
import com.passthesalt.repository.UserRepository;

@Configuration
public class DevDataSeeder {

    @Bean
    CommandLineRunner seedData(
            CourseRepository courseRepository,
            CourseDayRepository courseDayRepository,
            UserRepository userRepository,
            MobGroupRepository mobGroupRepository) {
        return args -> {
            if (courseRepository.count() > 0 || userRepository.count() > 0) {
                return;
            }

            Course course = new Course("Fullstack Hackweek", 10, LocalDate.now().minusDays(2));
            course = courseRepository.save(course);

            for (int i = 1; i <= course.getNumberOfDays(); i++) {
                courseDayRepository.save(new CourseDay(
                        course.getId(),
                        i,
                        course.getStartDate().plusDays(i - 1)));
            }

            MobGroup alpha = mobGroupRepository.save(new MobGroup(course.getId(), "Mob Alpha", "Frontend focus"));
            MobGroup beta = mobGroupRepository.save(new MobGroup(course.getId(), "Mob Beta", "Backend focus"));

            User admin = new User("admin@passthesalt.dev", "Admin User", "admin");
            admin.setCourseId(course.getId());
            admin.setMobGroupId(alpha.getId());

            User studentA = new User("sara@passthesalt.dev", "Sara Student", "user");
            studentA.setCourseId(course.getId());
            studentA.setMobGroupId(alpha.getId());

            User studentB = new User("alex@passthesalt.dev", "Alex Student", "user");
            studentB.setCourseId(course.getId());
            studentB.setMobGroupId(beta.getId());

            userRepository.saveAll(List.of(admin, studentA, studentB));
        };
    }
}
