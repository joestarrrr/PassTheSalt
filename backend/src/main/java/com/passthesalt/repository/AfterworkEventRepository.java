package com.passthesalt.repository;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;
import org.springframework.stereotype.Repository;
import com.passthesalt.model.AfterworkEvent;
@Repository
public class AfterworkEventRepository {
    private final Map<Long, AfterworkEvent> storage = new ConcurrentHashMap<>();
    private final AtomicLong idGenerator = new AtomicLong(0);
    public AfterworkEventRepository() {
        save(new AfterworkEvent(null, "Friday Social", "City Center", LocalDate.now().plusDays(2)));
        save(new AfterworkEvent(null, "Board Game Night", "Campus Hall", LocalDate.now().plusDays(7)));
    }
    public List<AfterworkEvent> findAll() {
        List<AfterworkEvent> items = new ArrayList<>(storage.values());
        items.sort(Comparator.comparing(AfterworkEvent::getId));
        return items;
    }
    public AfterworkEvent save(AfterworkEvent event) {
        if (event.getId() == null) {
            event.setId(idGenerator.incrementAndGet());
        }
        storage.put(event.getId(), event);
        return event;
    }
    public boolean deleteById(Long id) {
        return storage.remove(id) != null;
    }
    public long count() {
        return storage.size();
    }
}
