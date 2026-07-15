package com.aijobportal.backend.controller;

import com.aijobportal.backend.dto.ApplyJobRequest;
import com.aijobportal.backend.entity.JobApplication;
import com.aijobportal.backend.service.ApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;

    @PostMapping
    public ResponseEntity<JobApplication> apply(@RequestBody ApplyJobRequest request, Authentication authentication) {
        return ResponseEntity.ok(applicationService.applyToJob(request, authentication.getName()));
    }

    @GetMapping("/my")
    public ResponseEntity<List<JobApplication>> myApplications(Authentication authentication) {
        return ResponseEntity.ok(applicationService.getMyApplications(authentication.getName()));
    }

    @GetMapping("/job/{jobId}")
    public ResponseEntity<List<JobApplication>> applicantsForJob(@PathVariable Long jobId, Authentication authentication) {
        return ResponseEntity.ok(applicationService.getApplicantsForJob(jobId, authentication.getName()));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<JobApplication> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body,
                                                         Authentication authentication) {
        return ResponseEntity.ok(applicationService.updateStatus(id, body.get("status"), authentication.getName()));
    }
}
