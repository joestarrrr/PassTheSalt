package com.passthesalt.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.passthesalt.model.AwLocation;

@Repository
public interface AwLocationRepository extends JpaRepository<AwLocation, Long> {
    @Query("select l from AwLocation l where l.course.id = :courseId order by l.createdAt desc")
    List<AwLocation> findByCourseIdOrderByCreatedAtDesc(@Param("courseId") Long courseId);

    @Query("select l from AwLocation l where l.id = :locationId and l.course.id = :courseId")
    Optional<AwLocation> findByIdAndCourseId(@Param("locationId") Long locationId, @Param("courseId") Long courseId);
}