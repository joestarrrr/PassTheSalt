package com.passthesalt.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.passthesalt.dto.AdminDTO;
import com.passthesalt.service.AdminService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/admin")
@Validated
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
}