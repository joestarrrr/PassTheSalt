package com.passthesalt.controller;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.passthesalt.dto.MobGroupDTO;
import com.passthesalt.service.MobGroupService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/retros/forms")
@Validated
//@PreAuthorize("hasAnyRole('mob', 'admin')")
public class MobGroupController {
    private final MobGroupService mobGroupService;

    public MobGroupController(MobGroupService mobGroupService) {
        this.mobGroupService = mobGroupService;
    }

    @GetMapping
    public String getAllMobGroups() {
        return ("hi");
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MobGroupDTO submitForm(@Valid @RequestBody MobGroupDTO request) {
        return mobGroupService.submitForm(request);
    }
}
