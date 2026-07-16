package com.aijobportal.backend.controller;

import com.aijobportal.backend.dto.JobRequest;
import com.aijobportal.backend.entity.Job;
import com.aijobportal.backend.service.JobService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobService jobService;

    @GetMapping
    public ResponseEntity<List<Job>> getAllJobs(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Job.WorkMode workMode,
            @RequestParam(required = false) Job.JobType jobType) {

        if (keyword == null && location == null && workMode == null && jobType == null) {
            return ResponseEntity.ok(jobService.getAllActiveJobs());
        }
        return ResponseEntity.ok(jobService.searchJobs(keyword, location, workMode, jobType));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Job> getJob(@PathVariable Long id) {
        return ResponseEntity.ok(jobService.getJobById(id));
    }

    @GetMapping("/recommended")
    public ResponseEntity<List<Job>> getRecommendedJobs(Authentication authentication) {
        return ResponseEntity.ok(jobService.getRecommendedJobs(authentication.getName()));
    }

    @GetMapping("/my")
    public ResponseEntity<List<Job>> getMyJobs(Authentication authentication) {
        return ResponseEntity.ok(jobService.getMyJobs(authentication.getName()));
    }

    @PostMapping
    public ResponseEntity<Job> createJob(@Valid @RequestBody JobRequest request, Authentication authentication) {
        return ResponseEntity.ok(jobService.createJob(request, authentication.getName()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Job> updateJob(@PathVariable Long id, @Valid @RequestBody JobRequest request,
                                          Authentication authentication) {
        return ResponseEntity.ok(jobService.updateJob(id, request, authentication.getName()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteJob(@PathVariable Long id, Authentication authentication) {
        jobService.deleteJob(id, authentication.getName());
        return ResponseEntity.noContent().build();
    }
}
