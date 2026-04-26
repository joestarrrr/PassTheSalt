package com.passthesalt.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.passthesalt.dto.UserDTO;
import com.passthesalt.exception.ResourceNotFoundException;
import com.passthesalt.model.AfterworkEvent;
import com.passthesalt.repository.AfterworkEventRepository;
import com.passthesalt.repository.UserRepository;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final AfterworkEventRepository afterworkEventRepository;

    public UserService(UserRepository userRepository, AfterworkEventRepository afterworkEventRepository) {
        this.userRepository = userRepository;
        this.afterworkEventRepository = afterworkEventRepository;
    }

    public UserDTO createAfterworkEvent(UserDTO request) {
        validateUserExists(request.createdByUserId());

        AfterworkEvent event = afterworkEventRepository.save(new AfterworkEvent(
                null,
                request.title(),
                request.location(),
                request.eventDate(),
                request.createdByUserId()));

        return new UserDTO(event.id(), event.title(), event.location(), event.eventDate(), event.createdByUserId());
    }

    public List<UserDTO> getAfterworkEvents() {
        return afterworkEventRepository.findAll().stream()
                .map(this::toUserDTO)
                .toList();
    }

    public UserDTO updateAfterworkEvent(Long eventId, UserDTO request) {
        AfterworkEvent existingEvent = afterworkEventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Afterwork event not found with id " + eventId));

        validateUserExists(request.createdByUserId());

        AfterworkEvent updatedEvent = afterworkEventRepository.save(new AfterworkEvent(
                existingEvent.id(),
                request.title().trim(),
                request.location().trim(),
                request.eventDate(),
                request.createdByUserId()));

        return toUserDTO(updatedEvent);
    }

    public void deleteAfterworkEvent(Long eventId) {
        afterworkEventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Afterwork event not found with id " + eventId));
        afterworkEventRepository.deleteById(eventId);
    }

    private void validateUserExists(Long userId) {
        userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id " + userId));
    }

    private UserDTO toUserDTO(AfterworkEvent event) {
        return new UserDTO(event.id(), event.title(), event.location(), event.eventDate(), event.createdByUserId());
    }
}
