package com.aijobportal.backend.service.impl;

import com.aijobportal.backend.dto.JwtResponse;
import com.aijobportal.backend.dto.LoginRequest;
import com.aijobportal.backend.dto.RegisterRequest;
import com.aijobportal.backend.entity.Company;
import com.aijobportal.backend.entity.Role;
import com.aijobportal.backend.entity.User;
import com.aijobportal.backend.exception.BadRequestException;
import com.aijobportal.backend.repository.CompanyRepository;
import com.aijobportal.backend.repository.UserRepository;
import com.aijobportal.backend.security.JwtUtil;
import com.aijobportal.backend.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    @Override
    public JwtResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already registered");
        }

        if (request.getRole() == Role.ADMIN) {
            throw new BadRequestException("Admin accounts cannot be self-registered");
        }

        Company company = null;
        if (request.getRole() == Role.RECRUITER) {
            if (request.getCompanyName() == null || request.getCompanyName().isBlank()) {
                throw new BadRequestException("Company name is required for recruiters");
            }
            company = Company.builder()
                    .name(request.getCompanyName())
                    .approved(false) // Admin must approve the recruiter's company
                    .build();
            company = companyRepository.save(company);
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .company(company)
                .enabled(true)
                .build();

        user = userRepository.save(user);

        String token = jwtUtil.generateToken(user.getEmail());

        return JwtResponse.builder()
                .token(token)
                .type("Bearer")
                .userId(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }

    @Override
    public JwtResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("Invalid email or password"));

        String token = jwtUtil.generateToken(user.getEmail());

        return JwtResponse.builder()
                .token(token)
                .type("Bearer")
                .userId(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }
}
