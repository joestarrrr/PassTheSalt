package com.passthesalt.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.passthesalt.exception.ResourceNotFoundException;
import com.passthesalt.model.MobGroup;
import com.passthesalt.repository.MobGroupRepository;

@Service
public class MobGroupService {
    private final MobGroupRepository mobGroupRepository;

    public MobGroupService(MobGroupRepository mobGroupRepository) {
        this.mobGroupRepository = mobGroupRepository;
    }

    public List<MobGroup> getAll() {
        return mobGroupRepository.findAll();
    }

    public MobGroup create(MobGroup mobGroup) {
        mobGroup.setId(null);
        return mobGroupRepository.save(mobGroup);
    }

    public void delete(Long id) {
        if (!mobGroupRepository.deleteById(id)) {
            throw new ResourceNotFoundException("Mob group not found with id " + id);
        }
    }
}
