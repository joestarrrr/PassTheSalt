package com.passthesalt.model;

import java.time.LocalDate;

public record AfterworkEvent(Long id, String title, String location, LocalDate eventDate, Long createdByUserId) {
}

