package com.passthesalt.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.passthesalt.dto.AdminDTO;
import com.passthesalt.dto.AfterworkEventDTO;
import com.passthesalt.exception.BadRequestException;
import com.passthesalt.exception.ResourceNotFoundException;
import com.passthesalt.model.AfterworkEvent;
import com.passthesalt.model.MobGroup;
import com.passthesalt.model.User;
import com.passthesalt.repository.AfterworkEventRepository;
import com.passthesalt.repository.MobGroupRepository;
import com.passthesalt.repository.UserRepository;

@Service
public class AdminService {
        private final UserRepository userRepository;
        private final MobGroupRepository mobGroupRepository;
        private final AfterworkEventRepository afterworkEventRepository;

        public AdminService(
                        UserRepository userRepository,
                        MobGroupRepository mobGroupRepository,
                        AfterworkEventRepository afterworkEventRepository) {
                this.userRepository = userRepository;
                this.mobGroupRepository = mobGroupRepository;
                this.afterworkEventRepository = afterworkEventRepository;
        }

        public AdminDTO assignUserToMobGroup(Long mobGroupId, Long userId) {
                MobGroup mobGroup = mobGroupRepository.findById(mobGroupId)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Mob group not found with id " + mobGroupId));

                User user = userRepository.findById(userId)
                                .orElseThrow(() -> new ResourceNotFoundException("User not found with id " + userId));

                user.setMobGroupId(mobGroup.getId());
                User updatedUser = userRepository.save(user);

                return new AdminDTO(mobGroup.getId(), updatedUser.getId(), mobGroup.getName());
        }

        public AdminDTO renameMobGroup(Long mobGroupId, String groupName) {
                MobGroup mobGroup = mobGroupRepository.findById(mobGroupId)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Mob group not found with id " + mobGroupId));

                String normalizedName = groupName == null ? "" : groupName.trim();
                if (normalizedName.isEmpty()) {
                        throw new BadRequestException("mobGroupName is required");
                }

                mobGroup.setName(normalizedName);
                MobGroup updatedMobGroup = mobGroupRepository.save(mobGroup);
                return new AdminDTO(updatedMobGroup.getId(), null, updatedMobGroup.getName());
        }

        public List<AfterworkEventDTO> getAfterworkEvents() {
                return afterworkEventRepository.findAll().stream()
                                .map(this::toAfterworkEventDTO)
                                .toList();
        }

        public AfterworkEventDTO createAfterworkEvent(AfterworkEventDTO request) {
                validateUserExists(request.createdByUserId());

                AfterworkEvent createdEvent = afterworkEventRepository.save(new AfterworkEvent(
                                null,
                                request.title().trim(),
                                request.location().trim(),
                                request.eventDate(),
                                request.createdByUserId()));

                return toAfterworkEventDTO(createdEvent);
        }

        public AfterworkEventDTO updateAfterworkEvent(Long eventId, AfterworkEventDTO request) {
                AfterworkEvent existingEvent = afterworkEventRepository.findById(eventId)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Afterwork event not found with id " + eventId));

                validateUserExists(request.createdByUserId());

                AfterworkEvent updatedEvent = afterworkEventRepository.save(new AfterworkEvent(
                                existingEvent.getId(),
                                request.title().trim(),
                                request.location().trim(),
                                request.eventDate(),
                                request.createdByUserId()));

                return toAfterworkEventDTO(updatedEvent);
        }

        public void deleteAfterworkEvent(Long eventId) {
                afterworkEventRepository.findById(eventId)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Afterwork event not found with id " + eventId));
                afterworkEventRepository.deleteById(eventId);
        }

        private void validateUserExists(Long userId) {
                userRepository.findById(userId)
                                .orElseThrow(() -> new ResourceNotFoundException("User not found with id " + userId));
        }

        private AfterworkEventDTO toAfterworkEventDTO(AfterworkEvent event) {
                return new AfterworkEventDTO(
                                event.getId(),
                                event.getTitle(),
                                event.getLocation(),
                                event.getEventDate(),
                                event.getCreatedByUserId());
        }
}
