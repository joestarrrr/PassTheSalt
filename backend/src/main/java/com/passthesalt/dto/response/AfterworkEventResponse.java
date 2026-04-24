package com.passthesalt.dto.response;

import java.time.LocalDate;

public class AfterworkEventResponse {
    private Long id;
    private String title;
    private String location;
    private LocalDate eventDate;

    public AfterworkEventResponse() {
    }

    public AfterworkEventResponse(Long id, String title, String location, LocalDate eventDate) {
        this.id = id;
        this.title = title;
        this.location = location;
        this.eventDate = eventDate;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public LocalDate getEventDate() {
        return eventDate;
    }

    public void setEventDate(LocalDate eventDate) {
        this.eventDate = eventDate;
    }
}

