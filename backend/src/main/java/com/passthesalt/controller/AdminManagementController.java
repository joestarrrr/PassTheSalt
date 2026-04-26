package com.passthesalt.controller;

import com.passthesalt.dto.*;
import com.passthesalt.service.UserAssignmentService;
import com.passthesalt.service.CourseService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@Validated
@PreAuthorize("hasRole('admin')")
public class AdminManagementController {
    private final UserAssignmentService userAssignmentService;
    private final CourseService courseService;

    public AdminManagementController(UserAssignmentService userAssignmentService, CourseService courseService) {
        this.userAssignmentService = userAssignmentService;
        this.courseService = courseService;
    }

    // User assignment endpoints
    @PostMapping("/assign-user-to-course")
    public ResponseEntity<Void> assignUserToCourse(@Valid @RequestBody AssignUserToCourseDTO dto) {
        userAssignmentService.assignUserToCourse(dto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("/assign-user-to-mobgroup")
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
    public ResponseEntity<List<CreateMobGroupDTO>> getMobGroupsForCourse(@PathVariable Long courseId) {
        // This would require additional DTO mapping in the service
        return ResponseEntity.ok(List.of());
    }
}
