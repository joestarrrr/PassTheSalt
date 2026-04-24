package com.passthesalt.service;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.passthesalt.dto.MobGroupDTO;
import com.passthesalt.exception.ResourceNotFoundException;
import com.passthesalt.model.MobGroupFormSubmission;
import com.passthesalt.repository.MobGroupRepository;
import com.passthesalt.repository.MobGroupFormSubmissionRepository;
import com.passthesalt.repository.UserRepository;

@Service
public class MobGroupService {
    private final MobGroupRepository mobGroupRepository;
    private final UserRepository userRepository;
    private final MobGroupFormSubmissionRepository formSubmissionRepository;

    public MobGroupService(MobGroupRepository mobGroupRepository, UserRepository userRepository,
            MobGroupFormSubmissionRepository formSubmissionRepository) {
        this.mobGroupRepository = mobGroupRepository;
        this.userRepository = userRepository;
        this.formSubmissionRepository = formSubmissionRepository;
    }

    public MobGroupDTO submitForm(MobGroupDTO request) {
        mobGroupRepository.findById(request.mobGroupId())
                .orElseThrow(() -> new ResourceNotFoundException("Mob group not found with id " + request.mobGroupId()));
        userRepository.findById(request.submittedByUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id " + request.submittedByUserId()));

        MobGroupFormSubmission saved = formSubmissionRepository.save(new MobGroupFormSubmission(
                null,
                request.mobGroupId(),
                request.submittedByUserId(),
                request.formContent(),
                LocalDateTime.now()));

        return new MobGroupDTO(saved.id(), saved.mobGroupId(), saved.submittedByUserId(), saved.formContent(),
                saved.submittedAt());
    }
}
