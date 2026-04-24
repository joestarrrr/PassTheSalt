package com.passthesalt.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.passthesalt.exception.ResourceNotFoundException;
import com.passthesalt.model.AfterworkEvent;
import com.passthesalt.repository.AfterworkEventRepository;

@Service
public class AfterworkEventService {
    private final AfterworkEventRepository afterworkEventRepository;

    public AfterworkEventService(AfterworkEventRepository afterworkEventRepository) {
        this.afterworkEventRepository = afterworkEventRepository;
    }

    public List<AfterworkEvent> getAll() {
        return afterworkEventRepository.findAll();
    }

    public AfterworkEvent create(AfterworkEvent event) {
        event.setId(null);
        return afterworkEventRepository.save(event);
    }

    public void delete(Long id) {
        if (!afterworkEventRepository.deleteById(id)) {
            throw new ResourceNotFoundException("Afterwork event not found with id " + id);
        }
    }
}
