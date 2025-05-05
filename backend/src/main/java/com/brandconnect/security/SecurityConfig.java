package com.brandconnect.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    
    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }
    
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable()
            .cors().configurationSource(corsConfigurationSource())
            .and()
            .authorizeHttpRequests()
                // Public endpoints
                .requestMatchers("/api/auth/**").permitAll()
                
                // Make applications endpoints public
                .requestMatchers("/api/applications").permitAll()
                .requestMatchers("/api/applications/list").permitAll()
                .requestMatchers("/api/applications/all").permitAll()
                .requestMatchers("/api/applications/simple").permitAll()
                .requestMatchers("/api/applications/*/status").permitAll()
                
                // Brand-specific endpoints
                .requestMatchers("/api/campaigns/create").hasAuthority("BRAND")
                .requestMatchers("/api/campaigns").authenticated() 
                .requestMatchers("/api/campaigns/new").hasAuthority("BRAND")
                .requestMatchers("/api/campaigns/*/edit").hasAuthority("BRAND")
                .requestMatchers("/api/campaigns/*/delete").hasAuthority("BRAND")
                .requestMatchers("/api/applications/campaign/**").hasAuthority("BRAND")
                .requestMatchers("/api/dashboard/brand/**").hasAuthority("BRAND")
                
                // Creator-specific endpoints
                .requestMatchers("/api/saved-campaigns/**").hasAuthority("CREATOR")
                .requestMatchers("/api/applications/apply/**").hasAuthority("CREATOR")
                .requestMatchers("/api/applications/my").hasAuthority("CREATOR")
                .requestMatchers("/api/dashboard/creator/**").hasAuthority("CREATOR")
                
                // Common authenticated endpoints
                .requestMatchers("/api/campaigns/view/**").authenticated()
                .requestMatchers("/api/users/**").authenticated()
                .requestMatchers("/api/messages/**").authenticated()
                .requestMatchers("/api/notifications/**").authenticated()
                .requestMatchers("/api/profile/**").authenticated()
                
                .anyRequest().permitAll()
            .and()
            .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            .and()
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }
    
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
} 