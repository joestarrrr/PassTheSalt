package com.passthesalt.controller;

import com.passthesalt.dto.RetroDTO;
import com.passthesalt.service.RetroService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/retros")
@Validated
public class RetroController {
    private final RetroService retroService;

    public RetroController(RetroService retroService) {
        this.retroService = retroService;
    }

    @PostMapping
    public ResponseEntity<RetroDTO> submitRetro(@Valid @RequestBody RetroDTO retroDTO) {
        RetroDTO result = retroService.submitRetro(retroDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }

    @PutMapping("/{retroId}")
    public ResponseEntity<RetroDTO> updateRetro(@PathVariable Long retroId, @Valid @RequestBody RetroDTO retroDTO) {
        RetroDTO result = retroService.updateRetro(retroId, retroDTO);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<RetroDTO>> getRetrosByCourse(@PathVariable Long courseId) {
        List<RetroDTO> retros = retroService.getRetrosByCourse(courseId);
        return ResponseEntity.ok(retros);
    }

    @GetMapping("/course-day/{courseDayId}")
    public ResponseEntity<List<RetroDTO>> getRetrosByCourseDay(@PathVariable Long courseDayId) {
        List<RetroDTO> retros = retroService.getRetrosByCourseDay(courseDayId);
        return ResponseEntity.ok(retros);
    }

    @GetMapping("/course-day/{courseDayId}/mob-group/{mobGroupId}")
    public ResponseEntity<List<RetroDTO>> getRetrosByCourseDayAndMobGroup(
            @PathVariable Long courseDayId,
            @PathVariable Long mobGroupId) {
        List<RetroDTO> retros = retroService.getRetrosByCourseDayAndMobGroup(courseDayId, mobGroupId);
        return ResponseEntity.ok(retros);
    }
}
