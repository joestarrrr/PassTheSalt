package com.passthesalt.controller;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestHeader;

import com.passthesalt.dto.AwLocationDTO;
import com.passthesalt.dto.CreateAwLocationDTO;
import com.passthesalt.model.User;
import com.passthesalt.service.AwLocationService;
import com.passthesalt.service.CurrentUserResolver;

@RestController
@RequestMapping("/api/aw-locations")
@Validated
public class AwLocationController {
    private final AwLocationService awLocationService;
    private final CurrentUserResolver currentUserResolver;

    public AwLocationController(AwLocationService awLocationService, CurrentUserResolver currentUserResolver) {
        this.awLocationService = awLocationService;
        this.currentUserResolver = currentUserResolver;
    }

    @GetMapping
    public ResponseEntity<List<AwLocationDTO>> getAwLocations(
            @RequestParam Long courseId,
            @AuthenticationPrincipal Jwt jwt,
            @RequestHeader(value = "X-Clerk-Email", required = false) String clerkEmail) {
        User currentUser = currentUserResolver.resolve(jwt, clerkEmail);
        return ResponseEntity.ok(awLocationService.getAwLocations(courseId, currentUser));
    }

    @PostMapping
    public ResponseEntity<AwLocationDTO> createAwLocation(
            @Valid @RequestBody CreateAwLocationDTO request,
            @AuthenticationPrincipal Jwt jwt,
            @RequestHeader(value = "X-Clerk-Email", required = false) String clerkEmail) {
        User currentUser = currentUserResolver.resolve(jwt, clerkEmail);
        AwLocationDTO result = awLocationService.createAwLocation(request, currentUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }

    @PostMapping("/{locationId}/vote")
    public ResponseEntity<AwLocationDTO> voteAwLocation(
            @PathVariable Long locationId,
            @AuthenticationPrincipal Jwt jwt,
            @RequestHeader(value = "X-Clerk-Email", required = false) String clerkEmail) {
        User currentUser = currentUserResolver.resolve(jwt, clerkEmail);
        return ResponseEntity.ok(awLocationService.voteAwLocation(locationId, currentUser));
    }

    @DeleteMapping("/{locationId}/vote")
    public ResponseEntity<AwLocationDTO> removeAwVote(
            @PathVariable Long locationId,
            @AuthenticationPrincipal Jwt jwt,
            @RequestHeader(value = "X-Clerk-Email", required = false) String clerkEmail) {
        User currentUser = currentUserResolver.resolve(jwt, clerkEmail);
        return ResponseEntity.ok(awLocationService.removeAwVote(locationId, currentUser));
    }

    @GetMapping("/winner")
    public ResponseEntity<AwLocationDTO> getWinner(
            @RequestParam Long courseId,
            @AuthenticationPrincipal Jwt jwt,
            @RequestHeader(value = "X-Clerk-Email", required = false) String clerkEmail) {
        User currentUser = currentUserResolver.resolve(jwt, clerkEmail);
        return ResponseEntity.ok(awLocationService.getWinningAwLocation(courseId, currentUser));
    }
}