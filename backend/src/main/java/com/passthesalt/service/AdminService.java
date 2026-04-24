package com.passthesalt.service;

import org.springframework.stereotype.Service;

import com.passthesalt.dto.response.AdminDashboardSummaryResponse;
import com.passthesalt.repository.AfterworkEventRepository;
import com.passthesalt.repository.MobGroupRepository;
import com.passthesalt.repository.UserRepository;

@Service
public class AdminService {
    private final UserRepository userRepository;
    private final MobGroupRepository mobGroupRepository;
    private final AfterworkEventRepository afterworkEventRepository;

    public AdminService(UserRepository userRepository, MobGroupRepository mobGroupRepository,
            AfterworkEventRepository afterworkEventRepository) {
        this.userRepository = userRepository;
        this.mobGroupRepository = mobGroupRepository;
        this.afterworkEventRepository = afterworkEventRepository;
    }

    public AdminDashboardSummaryResponse getDashboardSummary() {
        return new AdminDashboardSummaryResponse(
                userRepository.count(),
                mobGroupRepository.count(),
                afterworkEventRepository.count());
    }
}
