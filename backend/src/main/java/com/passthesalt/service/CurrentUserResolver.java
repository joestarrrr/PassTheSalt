package com.passthesalt.service;

import java.util.Objects;

import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.passthesalt.exception.UnauthorizedException;
import com.passthesalt.model.User;
import com.passthesalt.repository.UserRepository;

@Service
public class CurrentUserResolver {
    private final UserRepository userRepository;
    private final ClerkUserService clerkUserService;

    public CurrentUserResolver(UserRepository userRepository, ClerkUserService clerkUserService) {
        this.userRepository = userRepository;
        this.clerkUserService = clerkUserService;
    }

    @Transactional
    public User resolve(Jwt jwt, String fallbackEmail) {
        if (jwt == null) {
            throw new UnauthorizedException("Missing authenticated Clerk session");
        }

        ClerkUserService.ClerkUserProfile profile = clerkUserService.resolveProfile(jwt, fallbackEmail);

        User user = userRepository.findByClerkUserId(profile.clerkUserId())
                .or(() -> userRepository.findByEmail(profile.email()))
                .orElseGet(User::new);

        if (user.getId() == null) {
            user.setClerkUserId(profile.clerkUserId());
            user.setEmail(profile.email());
            user.setFullName(profile.fullName());
            user.setRole(profile.role());
            return userRepository.save(user);
        }

        if (!Objects.equals(user.getClerkUserId(), profile.clerkUserId())) {
            user.setClerkUserId(profile.clerkUserId());
        }
        if (!profile.email().equalsIgnoreCase(user.getEmail())) {
            user.setEmail(profile.email());
        }
        if (profile.fullName() != null && !profile.fullName().isBlank() && !profile.fullName().equals(user.getFullName())) {
            user.setFullName(profile.fullName());
        }
        if ((user.getRole() == null || user.getRole().isBlank()) && profile.role() != null && !profile.role().isBlank()) {
            user.setRole(profile.role());
        }

        return userRepository.save(user);
    }
}