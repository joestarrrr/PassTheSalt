package com.passthesalt.controller;

import com.passthesalt.dto.*;
import com.passthesalt.service.UserAssignmentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@Validated
public class AdminManagementController {
    private final UserAssignmentService userAssignmentService;

    public AdminManagementController(UserAssignmentService userAssignmentService) {
        this.userAssignmentService = userAssignmentService;
    }

    // User assignment endpoints
    @PostMapping("/users/assign-course")
    public ResponseEntity<Void> assignUserToCourse(@Valid @RequestBody AssignUserToCourseDTO dto) {
        userAssignmentService.assignUserToCourse(dto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("/users/assign-mob-group")
    public ResponseEntity<Void> assignUserToMobGroup(@Valid @RequestBody AssignUserToMobGroupDTO dto) {
        userAssignmentService.assignUserToMobGroup(dto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    // Mob group management endpoints
    @PostMapping("/mob-groups")
    public ResponseEntity<Void> createMobGroup(@Valid @RequestBody CreateMobGroupDTO dto) {
        userAssignmentService.createMobGroup(dto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping("/courses/{courseId}/mob-groups")
    public ResponseEntity<List<MobGroupOptionDTO>> getMobGroupsForCourse(@PathVariable Long courseId) {
        return ResponseEntity.ok(userAssignmentService.getMobGroupsForCourse(courseId));
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserSummaryDTO>> getUsers(@RequestParam(required = false) Long courseId) {
        return ResponseEntity.ok(userAssignmentService.getUsers(courseId));
    }
}
