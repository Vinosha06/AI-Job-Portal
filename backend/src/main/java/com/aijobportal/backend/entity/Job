package com.aijobportal.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "jobs")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @Column(length = 100)
    private String category;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private JobType jobType; // FULL_TIME, PART_TIME, INTERNSHIP, CONTRACT

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private WorkMode workMode; // REMOTE, HYBRID, ONSITE

    private String location;

    private Double minSalary;

    private Double maxSalary;

    private String experienceRequired;

    @Column(columnDefinition = "TEXT")
    private String requiredSkills; // comma separated, used by AI matching

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @Builder.Default
    private boolean active = true;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum JobType {
        FULL_TIME, PART_TIME, INTERNSHIP, CONTRACT
    }

    public enum WorkMode {
        REMOTE, HYBRID, ONSITE
    }
}
