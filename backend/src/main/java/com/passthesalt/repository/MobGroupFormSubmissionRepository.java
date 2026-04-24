package com.passthesalt.repository;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

import org.springframework.stereotype.Repository;

import com.passthesalt.model.MobGroupFormSubmission;

@Repository
public class MobGroupFormSubmissionRepository {
    private final Map<Long, MobGroupFormSubmission> storage = new ConcurrentHashMap<>();
    private final AtomicLong idGenerator = new AtomicLong(0);

    public MobGroupFormSubmission save(MobGroupFormSubmission submission) {
        if (submission.id() == null) {
            submission = new MobGroupFormSubmission(idGenerator.incrementAndGet(), submission.mobGroupId(),
                    submission.submittedByUserId(), submission.formContent(), submission.submittedAt());
        }
        storage.put(submission.id(), submission);
        return submission;
    }
}

