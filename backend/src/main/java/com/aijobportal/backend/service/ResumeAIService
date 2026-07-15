package com.aijobportal.backend.service;

import com.aijobportal.backend.dto.ResumeAnalysisResponse;
import org.springframework.web.multipart.MultipartFile;

public interface ResumeAIService {
    ResumeAnalysisResponse analyzeResume(MultipartFile file, String userEmail) throws Exception;
    String generateCoverLetter(Long jobId, String userEmail);
    String generateInterviewQuestions(Long jobId);
}
