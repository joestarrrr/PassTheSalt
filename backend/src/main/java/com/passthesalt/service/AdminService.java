package com.passthesalt.service;

import org.springframework.stereotype.Service;

import com.passthesalt.dto.AdminDTO;
import com.passthesalt.exception.BadRequestException;
import com.passthesalt.exception.ResourceNotFoundException;
import com.passthesalt.model.MobGroup;
import com.passthesalt.model.User;
import com.passthesalt.repository.MobGroupRepository;
import com.passthesalt.repository.UserRepository;

@Service
public class AdminService {
    private final UserRepository userRepository;
    private final MobGroupRepository mobGroupRepository;

    public AdminService(UserRepository userRepository, MobGroupRepository mobGroupRepository) {
        this.userRepository = userRepository;
        this.mobGroupRepository = mobGroupRepository;
    }

    public AdminDTO assignUserToMobGroup(Long mobGroupId, Long userId) {
        MobGroup mobGroup = mobGroupRepository.findById(mobGroupId)
                .orElseThrow(() -> new ResourceNotFoundException("Mob group not found with id " + mobGroupId));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id " + userId));

        User updatedUser = new User(user.id(), user.email(), user.fullName(), user.role(), mobGroup.id());
        userRepository.save(updatedUser);

        return new AdminDTO(mobGroup.id(), updatedUser.id(), mobGroup.name());
    }

    public AdminDTO renameMobGroup(Long mobGroupId, String groupName) {
        MobGroup mobGroup = mobGroupRepository.findById(mobGroupId)
                .orElseThrow(() -> new ResourceNotFoundException("Mob group not found with id " + mobGroupId));

        String normalizedName = groupName == null ? "" : groupName.trim();
        if (normalizedName.isEmpty()) {
            throw new BadRequestException("mobGroupName is required");
        }

        MobGroup updatedMobGroup = mobGroupRepository
                .save(new MobGroup(mobGroup.id(), normalizedName, mobGroup.description()));
        return new AdminDTO(updatedMobGroup.id(), null, updatedMobGroup.name());
    }
}
