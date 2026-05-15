package com.passthesalt.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.passthesalt.model.User;
import com.passthesalt.repository.UserRepository;

@Service
public class CurrentUserResolver {
    private final UserRepository userRepository;

    public CurrentUserResolver(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public User resolve() {
        List<User> users = userRepository.findAll();
        if (!users.isEmpty()) {
            return users.get(0);
        }

        User defaultUser = new User();
        defaultUser.setEmail("local.admin@passthesalt.dev");
        defaultUser.setFullName("Local Admin");
        defaultUser.setRole("admin");
        return userRepository.save(defaultUser);
    }
}