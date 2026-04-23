package com.passthesalt.config;

import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtAuthenticationConverter jwtAuthenticationConverter)
            throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(Customizer.withDefaults())
                .sessionManagement(session -> session.sessionCreationPolicy(org.springframework.security.config.http.SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/admin/**").hasRole("admin")
                        .requestMatchers("/retros/**").hasAnyRole("mob", "admin")
                        .anyRequest().permitAll())
                .oauth2ResourceServer(oauth2 -> oauth2
                        .jwt(jwt -> jwt.jwtAuthenticationConverter(jwtAuthenticationConverter)));

        return http.build();
    }

    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
        converter.setJwtGrantedAuthoritiesConverter(this::extractAuthoritiesFromClerkJwt);
        return converter;
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:3000", "http://127.0.0.1:3000"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    private Collection<GrantedAuthority> extractAuthoritiesFromClerkJwt(Jwt jwt) {
        String role = extractRoleFromPublicMetadata(jwt);
        if (role == null || role.isBlank()) {
            return List.of();
        }

        return List.of(new SimpleGrantedAuthority("ROLE_" + role.toLowerCase(Locale.ROOT)));
    }

    private String extractRoleFromPublicMetadata(Jwt jwt) {
        Map<String, Object> publicMetadata = jwt.getClaimAsMap("public_metadata");
        if (publicMetadata == null || publicMetadata.isEmpty()) {
            publicMetadata = normalizeMap(jwt.getClaims().get("public_metadata"));
        }

        if (publicMetadata == null || publicMetadata.isEmpty()) {
            publicMetadata = normalizeMap(jwt.getClaims().get("publicMetadata"));
        }

        if (publicMetadata == null) {
            return null;
        }

        Object role = publicMetadata.get("role");
        return role == null ? null : role.toString();
    }

    private Map<String, Object> normalizeMap(Object value) {
        if (!(value instanceof Map<?, ?> rawMap)) {
            return null;
        }

        Map<String, Object> normalized = new HashMap<>();
        rawMap.forEach((key, mapValue) -> {
            if (key != null) {
                normalized.put(key.toString(), mapValue);
            }
        });
        return normalized;
    }
}
