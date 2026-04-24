package com.passthesalt.service;

import java.util.List;
import java.util.Locale;

import org.springframework.stereotype.Service;

import com.passthesalt.exception.ResourceNotFoundException;
import com.passthesalt.model.User;
import com.passthesalt.repository.UserRepository;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> getAll() {
        return userRepository.findAll();
    }

    public User create(User user) {
        user.setId(null);
        user.setRole(user.getRole().toLowerCase(Locale.ROOT));
        return userRepository.save(user);
    }

    public void delete(Long id) {
        if (!userRepository.deleteById(id)) {
            throw new ResourceNotFoundException("User not found with id " + id);
        }
    }
}
