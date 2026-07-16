export type Role = 'JOB_SEEKER' | 'RECRUITER' | 'ADMIN'

export interface AuthUser {
  userId: number
  fullName: string
  email: string
  role: Role
  token: string
}

export interface Company {
  id: number
  name: string
  description?: string
  website?: string
  location?: string
  approved: boolean
}

export type JobType = 'FULL_TIME' | 'PART_TIME' | 'INTERNSHIP' | 'CONTRACT'
export type WorkMode = 'REMOTE' | 'HYBRID' | 'ONSITE'

export interface Job {
  id: number
  title: string
  description: string
  category?: string
  jobType?: JobType
  workMode?: WorkMode
  location?: string
  minSalary?: number
  maxSalary?: number
  experienceRequired?: string
  requiredSkills?: string
  company: Company
  active: boolean
  createdAt: string
}

export type ApplicationStatus =
  | 'APPLIED'
  | 'SHORTLISTED'
  | 'INTERVIEW_SCHEDULED'
  | 'ACCEPTED'
  | 'REJECTED'

export interface Applicant {
  id: number
  fullName: string
  email: string
  photoUrl?: string
}

export interface JobApplication {
  id: number
  job: Job
  applicant: Applicant
  status: ApplicationStatus
  coverLetter?: string
  matchScore?: number
  appliedAt: string
}

export interface ResumeAnalysis {
  resumeId: number
  skillsFound: string[]
  missingSkills: string[]
  resumeScore: number
  atsScore: number
  suggestions: string[]
}

export interface Notification {
  id: number
  title: string
  message: string
  type: string
  isRead: boolean
  createdAt: string
}
