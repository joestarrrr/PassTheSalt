package com.passthesalt.controller;

import org.springframework.security.access.prepost.PreAuthorize;
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
@PreAuthorize("hasRole('admin')")
public class AdminController {
    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @PutMapping("/mob-groups/{mobGroupId}/users/{userId}")
    public AdminDTO assignUserToMobGroup(@PathVariable Long mobGroupId, @PathVariable Long userId) {
        return adminService.assignUserToMobGroup(mobGroupId, userId);
    }

    @PutMapping("/mob-groups/{mobGroupId}/name")
    public AdminDTO renameMobGroup(@PathVariable Long mobGroupId, @Valid @RequestBody AdminDTO request) {
        return adminService.renameMobGroup(mobGroupId, request.mobGroupName());
    }
}
