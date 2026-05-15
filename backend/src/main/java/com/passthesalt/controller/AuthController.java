package com.passthesalt.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.passthesalt.dto.CurrentUserDTO;
import com.passthesalt.model.User;
import com.passthesalt.service.CurrentUserResolver;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final CurrentUserResolver currentUserResolver;

    public AuthController(CurrentUserResolver currentUserResolver) {
        this.currentUserResolver = currentUserResolver;
    }

    @GetMapping("/me")
    public ResponseEntity<CurrentUserDTO> getCurrentUser() {
        User currentUser = currentUserResolver.resolve();
        return ResponseEntity.ok(new CurrentUserDTO(
                currentUser.getId(),
                currentUser.getEmail(),
                currentUser.getFullName(),
                currentUser.getRole(),
                currentUser.getCourseId(),
                currentUser.getMobGroupId()));
    }
}
