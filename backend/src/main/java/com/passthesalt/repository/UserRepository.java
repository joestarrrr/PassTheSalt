package com.passthesalt.repository;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

import org.springframework.stereotype.Repository;

import com.passthesalt.model.User;

@Repository
public class UserRepository {
    private final Map<Long, User> storage = new ConcurrentHashMap<>();
    private final AtomicLong idGenerator = new AtomicLong(0);

    public UserRepository() {
        save(new User(null, "admin@passthesalt.com", "Admin User", "admin", null));
        save(new User(null, "mob@passthesalt.com", "Mob Lead", "mob", null));
        save(new User(null, "student@passthesalt.com", "Student One", "student", null));
    }

    public Optional<User> findById(Long id) {
        return Optional.ofNullable(storage.get(id));
    }

    public User save(User user) {
        if (user.id() == null) {
            user = new User(idGenerator.incrementAndGet(), user.email(), user.fullName(), user.role(), user.mobGroupId());
        }
        storage.put(user.id(), user);
        return user;
    }
}
