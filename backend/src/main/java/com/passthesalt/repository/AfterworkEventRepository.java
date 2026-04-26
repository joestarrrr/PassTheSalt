package com.passthesalt.repository;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

import org.springframework.stereotype.Repository;

import com.passthesalt.model.AfterworkEvent;

@Repository
public class AfterworkEventRepository {
    private final Map<Long, AfterworkEvent> storage = new ConcurrentHashMap<>();
    private final AtomicLong idGenerator = new AtomicLong(0);

    public AfterworkEvent save(AfterworkEvent event) {
        if (event.id() == null) {
            event = new AfterworkEvent(idGenerator.incrementAndGet(), event.title(), event.location(),
                    event.eventDate(),
                    event.createdByUserId());
        }
        storage.put(event.id(), event);
        return event;
    }

    public List<AfterworkEvent> findAll() {
        List<AfterworkEvent> items = new ArrayList<>(storage.values());
        items.sort(Comparator.comparing(AfterworkEvent::id));
        return items;
    }

    public Optional<AfterworkEvent> findById(Long id) {
        return Optional.ofNullable(storage.get(id));
    }

    public void deleteById(Long id) {
        storage.remove(id);
    }
}
