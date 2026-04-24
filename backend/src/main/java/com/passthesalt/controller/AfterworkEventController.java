package com.passthesalt.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.passthesalt.dto.request.CreateAfterworkEventRequest;
import com.passthesalt.dto.response.AfterworkEventResponse;
import com.passthesalt.model.AfterworkEvent;
import com.passthesalt.service.AfterworkEventService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/admin/afterwork-events")
@Validated
@PreAuthorize("hasRole('admin')")
public class AfterworkEventController {
    private final AfterworkEventService afterworkEventService;

    public AfterworkEventController(AfterworkEventService afterworkEventService) {
        this.afterworkEventService = afterworkEventService;
    }

    @GetMapping
    public List<AfterworkEventResponse> getAfterworkEvents() {
        return afterworkEventService.getAll().stream()
                .map(this::toResponse)
                .toList();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AfterworkEventResponse createAfterworkEvent(@Valid @RequestBody CreateAfterworkEventRequest request) {
        AfterworkEvent event = new AfterworkEvent(null, request.getTitle(), request.getLocation(), request.getEventDate());
        return toResponse(afterworkEventService.create(event));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteAfterworkEvent(@PathVariable Long id) {
        afterworkEventService.delete(id);
    }

    private AfterworkEventResponse toResponse(AfterworkEvent event) {
        return new AfterworkEventResponse(event.getId(), event.getTitle(), event.getLocation(), event.getEventDate());
    }
}
