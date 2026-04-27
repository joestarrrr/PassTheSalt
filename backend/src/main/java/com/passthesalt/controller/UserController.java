package com.passthesalt.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.passthesalt.dto.UserCourseContextDTO;
import com.passthesalt.service.UserAssignmentService;

@RestController
@RequestMapping("/api/users")
@Validated
public class UserController {
    private final UserAssignmentService userAssignmentService;

    public UserController(UserAssignmentService userAssignmentService) {
        this.userAssignmentService = userAssignmentService;
    }

    @GetMapping("/{userId}/course-context")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserCourseContextDTO> getUserCourseContext(@PathVariable Long userId) {
        return ResponseEntity.ok(userAssignmentService.getUserCourseContext(userId));
    }
}
