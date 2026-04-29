package com.passthesalt.service;

import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.passthesalt.exception.UnauthorizedException;

@Service
public class ClerkUserService {
    private final HttpClient httpClient = HttpClient.newHttpClient();
    private final ObjectMapper objectMapper;

    @Value("${clerk.api-base-url:https://api.clerk.com/v1}")
    private String clerkApiBaseUrl;

    @Value("${clerk.secret-key:}")
    private String clerkSecretKey;

    public ClerkUserService(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    public ClerkUserProfile resolveProfile(Jwt jwt, String fallbackEmail) {
        String clerkUserId = jwt.getSubject();
        if (clerkUserId == null || clerkUserId.isBlank()) {
            throw new UnauthorizedException("Missing Clerk user id");
        }

        String email = firstNonBlank(jwt.getClaimAsString("email"), jwt.getClaimAsString("user_email"), fallbackEmail);
        String fullName = firstNonBlank(jwt.getClaimAsString("name"), jwt.getClaimAsString("full_name"));
        String role = firstNonBlank(jwt.getClaimAsString("role"), jwt.getClaimAsString("app_role"));

        ClerkUserProfile clerkProfile = fetchClerkProfile(clerkUserId);
        if (email == null) {
            email = clerkProfile.email();
        }
        if (fullName == null) {
            fullName = clerkProfile.fullName();
        }
        if (role == null) {
            role = clerkProfile.role();
        }

        if (email == null || email.isBlank()) {
            throw new UnauthorizedException(
                "Clerk session does not include an email address. " +
                    "Set CLERK_SECRET_KEY in the backend environment so the server can fetch the user's email from Clerk, " +
                    "or send X-Clerk-Email from the frontend during development.");
        }

        if (fullName == null || fullName.isBlank()) {
            fullName = email;
        }
        if (role == null || role.isBlank()) {
            role = "user";
        }

        return new ClerkUserProfile(clerkUserId, email, fullName, role);
    }

    private ClerkUserProfile fetchClerkProfile(String clerkUserId) {
        if (clerkSecretKey == null || clerkSecretKey.isBlank()) {
            return new ClerkUserProfile(clerkUserId, null, null, null);
        }

        try {
            String requestUrl = clerkApiBaseUrl + "/users/" + URLEncoder.encode(clerkUserId, StandardCharsets.UTF_8);
            HttpRequest request = HttpRequest.newBuilder(URI.create(requestUrl))
                    .header("Authorization", "Bearer " + clerkSecretKey.trim())
                    .header("Accept", "application/json")
                    .GET()
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                return new ClerkUserProfile(clerkUserId, null, null, null);
            }

            JsonNode payload = objectMapper.readTree(response.body());
            String email = extractPrimaryEmail(payload);
            String fullName = extractFullName(payload);
            String role = extractRole(payload);
            return new ClerkUserProfile(clerkUserId, email, fullName, role);
        } catch (InterruptedException ex) {
            Thread.currentThread().interrupt();
            return new ClerkUserProfile(clerkUserId, null, null, null);
        } catch (IOException ex) {
            return new ClerkUserProfile(clerkUserId, null, null, null);
        }
    }

    private String extractPrimaryEmail(JsonNode payload) {
        JsonNode emailAddresses = payload.path("email_addresses");
        if (!emailAddresses.isArray() || emailAddresses.isEmpty()) {
            return null;
        }

        String primaryEmailId = payload.path("primary_email_address_id").asText(null);
        if (primaryEmailId != null && !primaryEmailId.isBlank()) {
            for (JsonNode emailAddress : emailAddresses) {
                if (primaryEmailId.equals(emailAddress.path("id").asText(null))) {
                    return emailAddress.path("email_address").asText(null);
                }
            }
        }

        return emailAddresses.get(0).path("email_address").asText(null);
    }

    private String extractFullName(JsonNode payload) {
        String firstName = payload.path("first_name").asText("").trim();
        String lastName = payload.path("last_name").asText("").trim();
        String fullName = (firstName + " " + lastName).trim();
        if (!fullName.isBlank()) {
            return fullName;
        }

        String username = payload.path("username").asText("").trim();
        if (!username.isBlank()) {
            return username;
        }

        return null;
    }

    private String extractRole(JsonNode payload) {
        JsonNode publicMetadata = payload.path("public_metadata");
        if (publicMetadata.isObject()) {
            String role = publicMetadata.path("role").asText("").trim();
            if (!role.isBlank()) {
                return role;
            }
        }

        JsonNode unsafeMetadata = payload.path("unsafe_metadata");
        if (unsafeMetadata.isObject()) {
            String role = unsafeMetadata.path("role").asText("").trim();
            if (!role.isBlank()) {
                return role;
            }
        }

        return null;
    }

    private String firstNonBlank(String... values) {
        for (String value : values) {
            if (value != null && !value.trim().isBlank()) {
                return value.trim();
            }
        }
        return null;
    }

    public record ClerkUserProfile(String clerkUserId, String email, String fullName, String role) {
    }
}
