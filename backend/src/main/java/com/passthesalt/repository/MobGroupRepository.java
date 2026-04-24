package com.passthesalt.repository;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
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
    public List<MobGroup> findAll() {
        List<MobGroup> items = new ArrayList<>(storage.values());
        items.sort(Comparator.comparing(MobGroup::getId));
        return items;
    }
    public MobGroup save(MobGroup mobGroup) {
        if (mobGroup.getId() == null) {
            mobGroup.setId(idGenerator.incrementAndGet());
        }
        storage.put(mobGroup.getId(), mobGroup);
        return mobGroup;
    }
    public boolean deleteById(Long id) {
        return storage.remove(id) != null;
    }
    public long count() {
        return storage.size();
    }
}
