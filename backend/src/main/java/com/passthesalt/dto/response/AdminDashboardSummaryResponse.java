package com.passthesalt.dto.response;

public class AdminDashboardSummaryResponse {
    private long totalUsers;
    private long totalMobGroups;
    private long totalAfterworkEvents;

    public AdminDashboardSummaryResponse() {
    }

    public AdminDashboardSummaryResponse(long totalUsers, long totalMobGroups, long totalAfterworkEvents) {
        this.totalUsers = totalUsers;
        this.totalMobGroups = totalMobGroups;
        this.totalAfterworkEvents = totalAfterworkEvents;
    }

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getTotalMobGroups() {
        return totalMobGroups;
    }

    public void setTotalMobGroups(long totalMobGroups) {
        this.totalMobGroups = totalMobGroups;
    }

    public long getTotalAfterworkEvents() {
        return totalAfterworkEvents;
    }

    public void setTotalAfterworkEvents(long totalAfterworkEvents) {
        this.totalAfterworkEvents = totalAfterworkEvents;
    }
}

