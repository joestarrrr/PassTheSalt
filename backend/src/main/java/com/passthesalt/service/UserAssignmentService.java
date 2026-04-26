package com.passthesalt.service;

import com.passthesalt.dto.CreateMobGroupDTO;
import com.passthesalt.dto.AssignUserToMobGroupDTO;
import com.passthesalt.dto.AssignUserToCourseDTO;
import com.passthesalt.model.User;
import com.passthesalt.model.MobGroup;
import com.passthesalt.repository.UserRepository;
import com.passthesalt.repository.MobGroupRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserAssignmentService {
    private final UserRepository userRepository;
    private final MobGroupRepository mobGroupRepository;

    public UserAssignmentService(UserRepository userRepository, MobGroupRepository mobGroupRepository) {
        this.userRepository = userRepository;
        this.mobGroupRepository = mobGroupRepository;
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
}
