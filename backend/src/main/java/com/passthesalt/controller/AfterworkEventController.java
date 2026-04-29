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

import com.passthesalt.dto.AfterworkEventDTO;
import com.passthesalt.service.AdminService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/afterwork-events")
@Validated
public class AfterworkEventController {
    private final AdminService adminService;

    public AfterworkEventController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping
    public ResponseEntity<List<AfterworkEventDTO>> getAfterworkEvents() {
        return ResponseEntity.ok(adminService.getAfterworkEvents());
    }

    @PostMapping
    public ResponseEntity<AfterworkEventDTO> createAfterworkEvent(@Valid @RequestBody AfterworkEventDTO request) {
        AfterworkEventDTO result = adminService.createAfterworkEvent(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }

    @PutMapping("/{eventId}")
    public ResponseEntity<AfterworkEventDTO> updateAfterworkEvent(@PathVariable Long eventId,
            @Valid @RequestBody AfterworkEventDTO request) {
        AfterworkEventDTO result = adminService.updateAfterworkEvent(eventId, request);
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/{eventId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteAfterworkEvent(@PathVariable Long eventId) {
        adminService.deleteAfterworkEvent(eventId);
    }
}