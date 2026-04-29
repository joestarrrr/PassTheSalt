package com.passthesalt.repository;

import com.passthesalt.model.AfterworkEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AfterworkEventRepository extends JpaRepository<AfterworkEvent, Long> {
}
