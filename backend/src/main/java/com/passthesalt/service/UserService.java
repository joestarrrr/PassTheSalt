package com.passthesalt.service;

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
        userRepository.findById(request.createdByUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id " + request.createdByUserId()));

        AfterworkEvent event = afterworkEventRepository.save(new AfterworkEvent(
                null,
                request.title(),
                request.location(),
                request.eventDate(),
                request.createdByUserId()));

        return new UserDTO(event.id(), event.title(), event.location(), event.eventDate(), event.createdByUserId());
    }
}
