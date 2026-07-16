-- ============================================================
-- AI-Powered Job Portal - Reference Schema (MySQL 8+)
-- NOTE: Hibernate (spring.jpa.hibernate.ddl-auto=update) will
-- auto-create/update these tables on application startup.
-- This file is provided for reference / manual setup only.
-- ============================================================

CREATE DATABASE IF NOT EXISTS ai_job_portal;
USE ai_job_portal;

CREATE TABLE companies (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    website VARCHAR(255),
    logo_url VARCHAR(255),
    location VARCHAR(255),
    approved BOOLEAN DEFAULT FALSE,
    created_at DATETIME
);

CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL,
    phone VARCHAR(20),
    photo_url VARCHAR(255),
    bio TEXT,
    github_url VARCHAR(255),
    linkedin_url VARCHAR(255),
    enabled BOOLEAN DEFAULT TRUE,
    company_id BIGINT,
    created_at DATETIME,
    updated_at DATETIME,
    FOREIGN KEY (company_id) REFERENCES companies(id)
);

CREATE TABLE jobs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100),
    job_type VARCHAR(20),
    work_mode VARCHAR(20),
    location VARCHAR(255),
    min_salary DOUBLE,
    max_salary DOUBLE,
    experience_required VARCHAR(255),
    required_skills TEXT,
    company_id BIGINT NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at DATETIME,
    updated_at DATETIME,
    FOREIGN KEY (company_id) REFERENCES companies(id)
);

CREATE TABLE skills (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE user_skills (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    skill_id BIGINT NOT NULL,
    proficiency VARCHAR(20),
    UNIQUE KEY uq_user_skill (user_id, skill_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (skill_id) REFERENCES skills(id)
);

CREATE TABLE resumes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    extracted_text LONGTEXT,
    skills_found TEXT,
    missing_skills TEXT,
    ats_score INT,
    resume_score INT,
    uploaded_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE applications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    job_id BIGINT NOT NULL,
    applicant_id BIGINT NOT NULL,
    resume_id BIGINT,
    status VARCHAR(30) DEFAULT 'APPLIED',
    cover_letter TEXT,
    match_score INT,
    applied_at DATETIME,
    updated_at DATETIME,
    UNIQUE KEY uq_job_applicant (job_id, applicant_id),
    FOREIGN KEY (job_id) REFERENCES jobs(id),
    FOREIGN KEY (applicant_id) REFERENCES users(id),
    FOREIGN KEY (resume_id) REFERENCES resumes(id)
);

CREATE TABLE interviews (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    application_id BIGINT NOT NULL,
    scheduled_at DATETIME,
    mode VARCHAR(20),
    location VARCHAR(255),
    notes TEXT,
    status VARCHAR(20) DEFAULT 'SCHEDULED',
    created_at DATETIME,
    FOREIGN KEY (application_id) REFERENCES applications(id)
);

CREATE TABLE notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT,
    type VARCHAR(30),
    is_read BOOLEAN DEFAULT FALSE,
    created_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE activity_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    action VARCHAR(255) NOT NULL,
    details TEXT,
    timestamp DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
