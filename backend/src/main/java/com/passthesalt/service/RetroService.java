package com.passthesalt.service;

import com.passthesalt.dto.RetroDTO;
import com.passthesalt.model.Retro;
import com.passthesalt.repository.RetroRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RetroService {
    private final RetroRepository retroRepository;

    public RetroService(RetroRepository retroRepository) {
        this.retroRepository = retroRepository;
    }

    public RetroDTO submitRetro(RetroDTO retroDTO) {
        Retro retro = new Retro(
                retroDTO.courseId(),
                retroDTO.courseDayId(),
                retroDTO.mobGroupId(),
                retroDTO.userId(),
                retroDTO.startOfDay(),
                retroDTO.workedWell(),
                retroDTO.learned(),
                retroDTO.improve(),
                retroDTO.submissionDate(),
                retroDTO.rating(),
                retroDTO.lectureName());

        Retro savedRetro = retroRepository.save(retro);
        return mapRetroToDTO(savedRetro);
    }

    public List<RetroDTO> getRetrosByCourseDayAndMobGroup(Long courseDayId, Long mobGroupId) {
        return retroRepository.findByCourseDayIdAndMobGroupId(courseDayId, mobGroupId)
                .stream()
                .map(this::mapRetroToDTO)
                .collect(Collectors.toList());
    }

    public List<RetroDTO> getRetrosByCourse(Long courseId) {
        return retroRepository.findByCourseId(courseId)
                .stream()
                .map(this::mapRetroToDTO)
                .collect(Collectors.toList());
    }

    public List<RetroDTO> getRetrosByCourseDay(Long courseDayId) {
        return retroRepository.findByCourseDayId(courseDayId)
                .stream()
                .map(this::mapRetroToDTO)
                .collect(Collectors.toList());
    }

    private RetroDTO mapRetroToDTO(Retro retro) {
        return new RetroDTO(
                retro.getId(),
                retro.getCourseId(),
                retro.getCourseDayId(),
                retro.getMobGroupId(),
                retro.getUserId(),
                retro.getStartOfDay(),
                retro.getWorkedWell(),
                retro.getLearned(),
                retro.getImprove(),
                retro.getSubmissionDate(),
                retro.getRating(),
                retro.getLectureName());
    }
}
