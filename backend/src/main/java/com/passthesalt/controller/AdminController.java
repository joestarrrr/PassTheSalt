package com.passthesalt.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.passthesalt.dto.response.AdminDashboardSummaryResponse;
import com.passthesalt.service.AdminService;

@RestController
@RequestMapping("/api/admin/dashboard")
@PreAuthorize("hasRole('admin')")
public class AdminController {
    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/summary")
    public AdminDashboardSummaryResponse getSummary() {
        return adminService.getDashboardSummary();
    }
}
