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

import com.passthesalt.dto.request.CreateMobGroupRequest;
import com.passthesalt.dto.response.MobGroupResponse;
import com.passthesalt.model.MobGroup;
import com.passthesalt.service.MobGroupService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/admin/mob-groups")
@Validated
@PreAuthorize("hasRole('admin')")
public class MobGroupController {
    private final MobGroupService mobGroupService;

    public MobGroupController(MobGroupService mobGroupService) {
        this.mobGroupService = mobGroupService;
    }

    @GetMapping
    public List<MobGroupResponse> getMobGroups() {
        return mobGroupService.getAll().stream()
                .map(this::toResponse)
                .toList();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MobGroupResponse createMobGroup(@Valid @RequestBody CreateMobGroupRequest request) {
        MobGroup mobGroup = new MobGroup(null, request.getName(), request.getDescription());
        return toResponse(mobGroupService.create(mobGroup));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteMobGroup(@PathVariable Long id) {
        mobGroupService.delete(id);
    }

    private MobGroupResponse toResponse(MobGroup mobGroup) {
        return new MobGroupResponse(mobGroup.getId(), mobGroup.getName(), mobGroup.getDescription());
    }
}
