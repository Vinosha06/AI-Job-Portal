package com.aijobportal.backend.dto;

import com.aijobportal.backend.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class JwtResponse {
    private String token;
    private String type;
    private Long userId;
    private String fullName;
    private String email;
    private Role role;
}
