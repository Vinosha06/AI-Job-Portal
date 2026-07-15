package com.aijobportal.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "interviews")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Interview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "application_id", nullable = false)
    private JobApplication application;

    private LocalDateTime scheduledAt;

    private String mode; // ONLINE / ONSITE

    private String location; // meeting link or address

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    @Column(length = 20)
    private InterviewStatus status = InterviewStatus.SCHEDULED;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public enum InterviewStatus {
        SCHEDULED, COMPLETED, CANCELLED
    }
}
