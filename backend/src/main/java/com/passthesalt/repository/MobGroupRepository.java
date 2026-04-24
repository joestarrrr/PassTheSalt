package com.passthesalt.repository;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

import org.springframework.stereotype.Repository;

import com.passthesalt.model.MobGroup;

@Repository
public class MobGroupRepository {
    private final Map<Long, MobGroup> storage = new ConcurrentHashMap<>();
    private final AtomicLong idGenerator = new AtomicLong(0);

    public MobGroupRepository() {
        save(new MobGroup(null, "Mob Group A", "First mock mob group"));
        save(new MobGroup(null, "Mob Group B", "Second mock mob group"));
    }

    public Optional<MobGroup> findById(Long id) {
        return Optional.ofNullable(storage.get(id));
    }

    public MobGroup save(MobGroup mobGroup) {
        if (mobGroup.id() == null) {
            mobGroup = new MobGroup(idGenerator.incrementAndGet(), mobGroup.name(), mobGroup.description());
        }
        storage.put(mobGroup.id(), mobGroup);
        return mobGroup;
    }
}
