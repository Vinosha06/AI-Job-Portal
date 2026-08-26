package com.aijobportal.backend.dto;

import com.aijobportal.backend.entity.Job;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class JobRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    private String category;
    private Job.JobType jobType;
    private Job.WorkMode workMode;
    private String location;
    private Double minSalary;
    private Double maxSalary;
    private String experienceRequired;
    private String requiredSkills; // comma separated
}
