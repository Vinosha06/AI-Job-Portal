package com.aijobportal.backend.service.impl;

import com.aijobportal.backend.dto.ApplyJobRequest;
import com.aijobportal.backend.entity.*;
import com.aijobportal.backend.exception.BadRequestException;
import com.aijobportal.backend.exception.ResourceNotFoundException;
import com.aijobportal.backend.repository.*;
import com.aijobportal.backend.service.ApplicationService;
import com.aijobportal.backend.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ApplicationServiceImpl implements ApplicationService {

    private final JobApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final ResumeRepository resumeRepository;
    private final NotificationService notificationService;

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    @Override
    public JobApplication applyToJob(ApplyJobRequest request, String jobSeekerEmail) {
        User applicant = getUserByEmail(jobSeekerEmail);

        Job job = jobRepository.findById(request.getJobId())
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));

        applicationRepository.findByJobIdAndApplicantId(job.getId(), applicant.getId())
                .ifPresent(a -> { throw new BadRequestException("You have already applied to this job"); });

        Resume resume = null;
        if (request.getResumeId() != null) {
            resume = resumeRepository.findById(request.getResumeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Resume not found"));
        }

        JobApplication application = JobApplication.builder()
                .job(job)
                .applicant(applicant)
                .resume(resume)
                .coverLetter(request.getCoverLetter())
                .status(JobApplication.ApplicationStatus.APPLIED)
                .build();

        application = applicationRepository.save(application);

        notificationService.notify(applicant, "Application Submitted",
                "You applied for " + job.getTitle(), Notification.NotificationType.JOB_APPLIED);

        return application;
    }

    @Override
    public List<JobApplication> getMyApplications(String jobSeekerEmail) {
        User user = getUserByEmail(jobSeekerEmail);
        return applicationRepository.findByApplicantId(user.getId());
    }

    @Override
    public List<JobApplication> getApplicantsForJob(Long jobId, String recruiterEmail) {
        User recruiter = getUserByEmail(recruiterEmail);
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));

        if (!job.getCompany().getId().equals(recruiter.getCompany().getId())) {
            throw new BadRequestException("You are not allowed to view applicants for this job");
        }

        return applicationRepository.findByJobId(jobId);
    }

    @Override
    public JobApplication updateStatus(Long applicationId, String status, String recruiterEmail) {
        User recruiter = getUserByEmail(recruiterEmail);
        JobApplication application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));

        if (!application.getJob().getCompany().getId().equals(recruiter.getCompany().getId())) {
            throw new BadRequestException("You are not allowed to update this application");
        }

        JobApplication.ApplicationStatus newStatus;
        try {
            newStatus = JobApplication.ApplicationStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid status: " + status);
        }

        application.setStatus(newStatus);
        application = applicationRepository.save(application);

        Notification.NotificationType type = switch (newStatus) {
            case ACCEPTED -> Notification.NotificationType.APPLICATION_ACCEPTED;
            case REJECTED -> Notification.NotificationType.APPLICATION_REJECTED;
            case INTERVIEW_SCHEDULED -> Notification.NotificationType.INTERVIEW_INVITATION;
            default -> Notification.NotificationType.JOB_APPLIED;
        };

        notificationService.notify(application.getApplicant(), "Application Update",
                "Your application for " + application.getJob().getTitle() + " is now " + newStatus, type);

        return application;
    }
}
