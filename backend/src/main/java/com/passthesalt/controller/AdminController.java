package com.passthesalt.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.ResponseStatus;

import com.passthesalt.dto.AdminDTO;
import com.passthesalt.dto.AfterworkEventDTO;
import com.passthesalt.service.AdminService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/admin")
@Validated
@PreAuthorize("hasRole('admin')")
public class AdminController {
    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @PutMapping("/mob-groups/{mobGroupId}/users/{userId}")
    public ResponseEntity<AdminDTO> assignUserToMobGroup(@PathVariable Long mobGroupId, @PathVariable Long userId) {
        AdminDTO result = adminService.assignUserToMobGroup(mobGroupId, userId);
        return ResponseEntity.ok(result);
    }

    @PutMapping("/mob-groups/{mobGroupId}/name")
    public ResponseEntity<AdminDTO> renameMobGroup(@PathVariable Long mobGroupId,
            @Valid @RequestBody AdminDTO request) {
        AdminDTO result = adminService.renameMobGroup(mobGroupId, request.mobGroupName());
        return ResponseEntity.ok(result);
    }

    @GetMapping("/afterwork-events")
    public ResponseEntity<List<AfterworkEventDTO>> getAfterworkEvents() {
        return ResponseEntity.ok(adminService.getAfterworkEvents());
    }

    @PostMapping("/afterwork-events")
    public ResponseEntity<AfterworkEventDTO> createAfterworkEvent(@Valid @RequestBody AfterworkEventDTO request) {
        AfterworkEventDTO result = adminService.createAfterworkEvent(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }

    @PutMapping("/afterwork-events/{eventId}")
    public ResponseEntity<AfterworkEventDTO> updateAfterworkEvent(@PathVariable Long eventId,
            @Valid @RequestBody AfterworkEventDTO request) {
        AfterworkEventDTO result = adminService.updateAfterworkEvent(eventId, request);
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/afterwork-events/{eventId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteAfterworkEvent(@PathVariable Long eventId) {
        adminService.deleteAfterworkEvent(eventId);
    }
}