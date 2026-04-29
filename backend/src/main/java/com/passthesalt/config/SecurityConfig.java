package com.passthesalt.config;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.oauth2.server.resource.web.DefaultBearerTokenResolver;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidatorResult;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.core.DelegatingOAuth2TokenValidator;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtValidators;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class SecurityConfig {

    private static final List<String> ALLOWED_ORIGINS = List.of(
            // Local development
            "http://localhost:3001",
            "http://localhost:5173",
            "http://127.0.0.1:3001",
            "http://127.0.0.1:5173",
            // Production
            "https://passthesalt-production.up.railway.app",
            "https://joestarrrr.github.io");

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(Customizer.withDefaults())
                .sessionManagement(session -> session.sessionCreationPolicy(
                        org.springframework.security.config.http.SessionCreationPolicy.STATELESS))
                .httpBasic(AbstractHttpConfigurer::disable)
                .formLogin(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .anyRequest().authenticated())
                .oauth2ResourceServer(oauth2 -> oauth2
                        .bearerTokenResolver(new DefaultBearerTokenResolver())
                        .jwt(Customizer.withDefaults()));

        return http.build();
    }

    @Bean
    public JwtDecoder jwtDecoder(
            @Value("${clerk.frontend-api-url}") String clerkFrontendApiUrl,
            @Value("${clerk.jwks-uri:${clerk.frontend-api-url}/.well-known/jwks.json}") String clerkJwksUri) {
        NimbusJwtDecoder decoder = NimbusJwtDecoder.withJwkSetUri(clerkJwksUri).build();
        OAuth2TokenValidator<Jwt> defaultValidator = JwtValidators.createDefault();
        OAuth2TokenValidator<Jwt> issuerValidator = token -> {
            String tokenIssuer = token.getIssuer() != null ? token.getIssuer().toString() : "";
            String configuredIssuer = clerkFrontendApiUrl != null ? clerkFrontendApiUrl : "";

            String normalizedTokenIssuer = tokenIssuer.endsWith("/")
                    ? tokenIssuer.substring(0, tokenIssuer.length() - 1)
                    : tokenIssuer;
            String normalizedConfiguredIssuer = configuredIssuer.endsWith("/")
                    ? configuredIssuer.substring(0, configuredIssuer.length() - 1)
                    : configuredIssuer;

            if (normalizedTokenIssuer.equals(normalizedConfiguredIssuer)) {
                return OAuth2TokenValidatorResult.success();
            }

            return OAuth2TokenValidatorResult.failure(
                    new OAuth2Error("invalid_token", "Invalid issuer", null));
        };

        decoder.setJwtValidator(new DelegatingOAuth2TokenValidator<>(defaultValidator, issuerValidator));
        return decoder;
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(ALLOWED_ORIGINS);
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
                configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
