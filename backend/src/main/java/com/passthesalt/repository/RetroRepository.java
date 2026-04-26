package com.passthesalt.repository;

import com.passthesalt.model.Retro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RetroRepository extends JpaRepository<Retro, Long> {
    List<Retro> findByCourseDayIdAndMobGroupId(Long courseDayId, Long mobGroupId);

    List<Retro> findByCourseId(Long courseId);

    List<Retro> findByCourseDayId(Long courseDayId);
}
