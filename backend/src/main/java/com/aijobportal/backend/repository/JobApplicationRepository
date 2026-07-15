package com.aijobportal.backend.repository;

import com.aijobportal.backend.entity.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {
    List<JobApplication> findByApplicantId(Long applicantId);
    List<JobApplication> findByJobId(Long jobId);
    Optional<JobApplication> findByJobIdAndApplicantId(Long jobId, Long applicantId);
    long countByJobCompanyId(Long companyId);
}
