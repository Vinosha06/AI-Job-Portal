package com.aijobportal.backend.service;

import com.aijobportal.backend.dto.ApplyJobRequest;
import com.aijobportal.backend.entity.JobApplication;

import java.util.List;

public interface ApplicationService {
    JobApplication applyToJob(ApplyJobRequest request, String jobSeekerEmail);
    List<JobApplication> getMyApplications(String jobSeekerEmail);
    List<JobApplication> getApplicantsForJob(Long jobId, String recruiterEmail);
    JobApplication updateStatus(Long applicationId, String status, String recruiterEmail);
}
