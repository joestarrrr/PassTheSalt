package com.passthesalt.controller;

import org.springframework.security.core.Authentication;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping
public class AccessController {

    @GetMapping("/admin/overview")
    @PreAuthorize("hasRole('admin')")
    public String adminOverview() {
        return "Admin only endpoint";
    }

    @GetMapping("/retros/summary")
    @PreAuthorize("hasAnyRole('mob', 'admin')")
    public String retrosSummary() {
        return "Mob or admin endpoint";
    }

    @GetMapping("/profile")
    @PreAuthorize("isAuthenticated()")
    public String profile(Authentication authentication) {
        return "Authenticated as: " + authentication.getName();
    }
}
