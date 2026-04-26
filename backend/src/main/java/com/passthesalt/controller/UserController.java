package com.passthesalt.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.passthesalt.dto.UserDTO;
import com.passthesalt.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/users")
@Validated
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/afterwork-events")
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("isAuthenticated()")
    public UserDTO createAfterworkEvent(@Valid @RequestBody UserDTO request) {
        return userService.createAfterworkEvent(request);
    }

    @GetMapping("/afterwork-events")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<UserDTO>> getAfterworkEvents() {
        return ResponseEntity.ok(userService.getAfterworkEvents());
    }

    @PutMapping("/afterwork-events/{eventId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserDTO> updateAfterworkEvent(@PathVariable Long eventId,
            @Valid @RequestBody UserDTO request) {
        return ResponseEntity.ok(userService.updateAfterworkEvent(eventId, request));
    }

    @DeleteMapping("/afterwork-events/{eventId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("isAuthenticated()")
    public void deleteAfterworkEvent(@PathVariable Long eventId) {
        userService.deleteAfterworkEvent(eventId);
    }
}
