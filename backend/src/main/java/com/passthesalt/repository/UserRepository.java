package com.passthesalt.repository;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;
import org.springframework.stereotype.Repository;
import com.passthesalt.model.User;
@Repository
public class UserRepository {
    private final Map<Long, User> storage = new ConcurrentHashMap<>();
    private final AtomicLong idGenerator = new AtomicLong(0);
    public UserRepository() {
        save(new User(null, "admin@passthesalt.com", "Admin User", "admin"));
        save(new User(null, "mob@passthesalt.com", "Mob Lead", "mob"));
        save(new User(null, "student@passthesalt.com", "Student One", "student"));
    }
    public List<User> findAll() {
        List<User> items = new ArrayList<>(storage.values());
        items.sort(Comparator.comparing(User::getId));
        return items;
    }
    public User save(User user) {
        if (user.getId() == null) {
            user.setId(idGenerator.incrementAndGet());
        }
        storage.put(user.getId(), user);
        return user;
    }
    public boolean deleteById(Long id) {
        return storage.remove(id) != null;
    }
    public long count() {
        return storage.size();
    }
    public long countByRole(String role) {
        String normalizedRole = role == null ? "" : role.toLowerCase(Locale.ROOT);
        return storage.values().stream()
                .filter(user -> normalizedRole.equals(user.getRole() == null ? "" : user.getRole().toLowerCase(Locale.ROOT)))
                .count();
    }
}
