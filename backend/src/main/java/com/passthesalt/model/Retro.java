package com.passthesalt.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "retros")
public class Retro {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long courseId;

    @Column(nullable = false)
    private Long courseDayId;

    @Column(nullable = false)
    private Long mobGroupId;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private String startOfDay;

    @Column(columnDefinition = "TEXT")
    private String workedWell;

    @Column(columnDefinition = "TEXT")
    private String learned;

    @Column(columnDefinition = "TEXT")
    private String improve;

    @Column(nullable = false)
    private LocalDate submissionDate;

    @Column
    private Integer rating;

    @Column
    private String lectureName;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    // Constructors
    public Retro() {
    }

    public Retro(Long courseId, Long courseDayId, Long mobGroupId, Long userId,
            String startOfDay, String workedWell, String learned, String improve,
            LocalDate submissionDate, Integer rating, String lectureName) {
        this.courseId = courseId;
        this.courseDayId = courseDayId;
        this.mobGroupId = mobGroupId;
        this.userId = userId;
        this.startOfDay = startOfDay;
        this.workedWell = workedWell;
        this.learned = learned;
        this.improve = improve;
        this.submissionDate = submissionDate;
        this.rating = rating;
        this.lectureName = lectureName;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getCourseId() {
        return courseId;
    }

    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }

    public Long getCourseDayId() {
        return courseDayId;
    }

    public void setCourseDayId(Long courseDayId) {
        this.courseDayId = courseDayId;
    }

    public Long getMobGroupId() {
        return mobGroupId;
    }

    public void setMobGroupId(Long mobGroupId) {
        this.mobGroupId = mobGroupId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getStartOfDay() {
        return startOfDay;
    }

    public void setStartOfDay(String startOfDay) {
        this.startOfDay = startOfDay;
    }

    public String getWorkedWell() {
        return workedWell;
    }

    public void setWorkedWell(String workedWell) {
        this.workedWell = workedWell;
    }

    public String getLearned() {
        return learned;
    }

    public void setLearned(String learned) {
        this.learned = learned;
    }

    public String getImprove() {
        return improve;
    }

    public void setImprove(String improve) {
        this.improve = improve;
    }

    public LocalDate getSubmissionDate() {
        return submissionDate;
    }

    public void setSubmissionDate(LocalDate submissionDate) {
        this.submissionDate = submissionDate;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public String getLectureName() {
        return lectureName;
    }

    public void setLectureName(String lectureName) {
        this.lectureName = lectureName;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
