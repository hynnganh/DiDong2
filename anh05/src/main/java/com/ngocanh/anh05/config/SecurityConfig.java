package com.ngocanh.anh05.config;

import com.ngocanh.anh05.security.JWTFilter;
import com.ngocanh.anh05.service.impl.UserDetailsServiceImpl;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
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

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Autowired
    private JWTFilter jwtFilter;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(requests -> requests
                // ✅ Ưu tiên cho phép các endpoint đăng ký/đăng nhập công khai
                .requestMatchers("/api/register/**", "/api/login/**","/api/forgot-password/**").permitAll()
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                
                // ✅ Các URL công khai từ AppConstants
                .requestMatchers(AppConstants.PUBLIC_URLS).permitAll()
                
                // ✅ Phân quyền cho User và Admin
                .requestMatchers(AppConstants.USER_URLS).hasAnyAuthority("USER", "ADMIN")
                .requestMatchers(AppConstants.ADMIN_URLS).hasAuthority("ADMIN")
                
                // ✅ Tất cả các request còn lại phải có Token
                .anyRequest().authenticated()
            )
            .exceptionHandling(handling -> handling.authenticationEntryPoint(
                (request, response, authException) -> {
                    // Trả về JSON lỗi thay vì trang web lỗi mặc định
                    response.setContentType("application/json");
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.getWriter().write("{\"error\": \"Unauthorized\", \"message\": \"" + authException.getMessage() + "\"}");
                }
            ))
            .sessionManagement(management -> management.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        // ✅ Quan trọng: Phải đặt filter JWT trước filter xác thực mặc định
        http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
        http.authenticationProvider(daoAuthenticationProvider());
        
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOriginPatterns(List.of("*")); 
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        // ✅ Cho phép tất cả các Header phổ biến để tránh lỗi 403
        config.setAllowedHeaders(List.of("Authorization", "Content-Type", "Accept", "email", "X-Requested-With"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public DaoAuthenticationProvider daoAuthenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }
}