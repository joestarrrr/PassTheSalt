package com.passthesalt.service;

import java.util.Comparator;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.passthesalt.dto.AwLocationDTO;
import com.passthesalt.dto.CreateAwLocationDTO;
import com.passthesalt.exception.BadRequestException;
import com.passthesalt.exception.ForbiddenException;
import com.passthesalt.exception.ResourceNotFoundException;
import com.passthesalt.model.AwLocation;
import com.passthesalt.model.AwVote;
import com.passthesalt.model.Course;
import com.passthesalt.model.User;
import com.passthesalt.repository.AwLocationRepository;
import com.passthesalt.repository.AwVoteRepository;
import com.passthesalt.repository.CourseRepository;

@Service
public class AwLocationService {
    private final AwLocationRepository awLocationRepository;
    private final AwVoteRepository awVoteRepository;
    private final CourseRepository courseRepository;

    public AwLocationService(
            AwLocationRepository awLocationRepository,
            AwVoteRepository awVoteRepository,
            CourseRepository courseRepository) {
        this.awLocationRepository = awLocationRepository;
        this.awVoteRepository = awVoteRepository;
        this.courseRepository = courseRepository;
    }

    public List<AwLocationDTO> getAwLocations(Long courseId, User currentUser) {
        validateCourseMembership(currentUser, courseId);

        return awLocationRepository.findByCourseIdOrderByCreatedAtDesc(courseId).stream()
                .map(location -> toDto(location, currentUser))
                .toList();
    }

    @Transactional
    public AwLocationDTO createAwLocation(CreateAwLocationDTO request, User currentUser) {
        validateCourseMembership(currentUser, request.courseId());

        Course course = courseRepository.findById(request.courseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id " + request.courseId()));

        AwLocation location = awLocationRepository.save(new AwLocation(
                course,
                currentUser,
                request.name().trim(),
                request.lng(),
                request.lat()));

        return toDto(location, currentUser);
    }

    @Transactional
    public AwLocationDTO voteAwLocation(Long locationId, User currentUser) {
        AwLocation location = getLocationForCurrentUser(locationId, currentUser);

        if (awVoteRepository.existsByUser_IdAndAwLocation_Id(currentUser.getId(), locationId)) {
            throw new BadRequestException("You have already voted for this location");
        }

        awVoteRepository.save(new AwVote(currentUser, location));
        return toDto(location, currentUser);
    }

    @Transactional
    public AwLocationDTO removeAwVote(Long locationId, User currentUser) {
        AwLocation location = getLocationForCurrentUser(locationId, currentUser);
        AwVote vote = awVoteRepository.findByUser_IdAndAwLocation_Id(currentUser.getId(), locationId)
                .orElseThrow(() -> new ResourceNotFoundException("Vote not found for this location"));

        awVoteRepository.delete(vote);
        return toDto(location, currentUser);
    }

    public AwLocationDTO getWinningAwLocation(Long courseId, User currentUser) {
        validateCourseMembership(currentUser, courseId);

        List<AwLocation> locations = awLocationRepository.findByCourseIdOrderByCreatedAtDesc(courseId);
        AwLocation winner = locations.stream()
                .max(Comparator.comparingLong((AwLocation location) -> awVoteRepository.countByAwLocation_Id(location.getId()))
                        .thenComparing(AwLocation::getCreatedAt, Comparator.reverseOrder()))
                .orElseThrow(() -> new ResourceNotFoundException("No afterwork locations found for course " + courseId));

        return toDto(winner, currentUser);
    }

    private AwLocation getLocationForCurrentUser(Long locationId, User currentUser) {
        AwLocation location = awLocationRepository.findById(locationId)
                .orElseThrow(() -> new ResourceNotFoundException("Afterwork location not found with id " + locationId));

        validateCourseMembership(currentUser, location.getCourse().getId());
        return location;
    }

    private void validateCourseMembership(User currentUser, Long courseId) {
        if (currentUser.getCourseId() == null || !currentUser.getCourseId().equals(courseId)) {
            throw new ForbiddenException("You do not have access to this course");
        }
    }

    private AwLocationDTO toDto(AwLocation location, User currentUser) {
        long voteCount = awVoteRepository.countByAwLocation_Id(location.getId());
        boolean votedByCurrentUser = awVoteRepository.existsByUser_IdAndAwLocation_Id(currentUser.getId(), location.getId());

        return new AwLocationDTO(
                location.getId(),
                location.getCourse().getId(),
                location.getName(),
                location.getLng(),
                location.getLat(),
                location.getCreatedBy().getId(),
                location.getCreatedBy().getFullName(),
                voteCount,
                votedByCurrentUser);
    }
}