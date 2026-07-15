package com.aijobportal.backend.controller;

import com.aijobportal.backend.dto.ResumeAnalysisResponse;
import com.aijobportal.backend.service.ResumeAIService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/resume")
@RequiredArgsConstructor
public class ResumeController {

    private final ResumeAIService resumeAIService;

    @PostMapping(value = "/analyze", consumes = "multipart/form-data")
    public ResponseEntity<ResumeAnalysisResponse> analyze(@RequestParam("file") MultipartFile file,
                                                            Authentication authentication) throws Exception {
        return ResponseEntity.ok(resumeAIService.analyzeResume(file, authentication.getName()));
    }

    @GetMapping("/cover-letter/{jobId}")
    public ResponseEntity<String> coverLetter(@PathVariable Long jobId, Authentication authentication) {
        return ResponseEntity.ok(resumeAIService.generateCoverLetter(jobId, authentication.getName()));
    }

    @GetMapping("/interview-questions/{jobId}")
    public ResponseEntity<String> interviewQuestions(@PathVariable Long jobId) {
        return ResponseEntity.ok(resumeAIService.generateInterviewQuestions(jobId));
    }
}
