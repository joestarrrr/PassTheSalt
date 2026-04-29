package com.passthesalt.config;

import java.time.LocalDate;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import com.passthesalt.model.Course;
import com.passthesalt.model.CourseDay;
import com.passthesalt.model.MobGroup;
import com.passthesalt.model.User;
import com.passthesalt.repository.CourseDayRepository;
import com.passthesalt.repository.CourseRepository;
import com.passthesalt.repository.MobGroupRepository;
import com.passthesalt.repository.UserRepository;

@Configuration
@Profile("local")
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

            User realAdmin = new User("alekmillionaire@salt.dev", "Alek Admin", "admin");
            realAdmin.setCourseId(course.getId());
            realAdmin.setMobGroupId(alpha.getId());

            User user = new User("venujan.nagendirakumer@salt.dev", "Venujan User", "user");
            user.setCourseId(course.getId());
            user.setMobGroupId(alpha.getId());

            User mobMember = new User("notajm@salt.dev", "Mob Member", "mob");
            mobMember.setCourseId(course.getId());
            mobMember.setMobGroupId(beta.getId());

            userRepository.saveAll(List.of(realAdmin, user, mobMember));
        };
    }
}
