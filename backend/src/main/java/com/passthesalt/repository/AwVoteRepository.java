package com.passthesalt.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.passthesalt.model.AwVote;

@Repository
public interface AwVoteRepository extends JpaRepository<AwVote, Long> {
    Optional<AwVote> findByUser_IdAndAwLocation_Id(Long userId, Long awLocationId);

    boolean existsByUser_IdAndAwLocation_Id(Long userId, Long awLocationId);

    long countByAwLocation_Id(Long awLocationId);

    void deleteByUser_IdAndAwLocation_Id(Long userId, Long awLocationId);
}