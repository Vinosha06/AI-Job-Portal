import { useEffect, useState } from 'react'
import api from '../api/axios'
import { ApplicationStatus, Job, JobApplication } from '../types'

const statusOptions: ApplicationStatus[] = [
  'APPLIED', 'SHORTLISTED', 'INTERVIEW_SCHEDULED', 'ACCEPTED', 'REJECTED',
]

export default function RecruiterApplicants() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null)
  const [applications, setApplications] = useState<JobApplication[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api.get('/jobs/my').then((res) => {
      setJobs(res.data)
      if (res.data.length > 0) setSelectedJobId(res.data[0].id)
    })
  }, [])

  useEffect(() => {
    if (!selectedJobId) return
    setLoading(true)
    api.get(`/applications/job/${selectedJobId}`).then((res) => {
      setApplications(res.data)
      setLoading(false)
    })
  }, [selectedJobId])

  const updateStatus = async (applicationId: number, status: ApplicationStatus) => {
    await api.patch(`/applications/${applicationId}/status`, { status })
    setApplications((prev) => prev.map((a) => (a.id === applicationId ? { ...a, status } : a)))
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Applicants</h1>

      {jobs.length === 0 ? (
        <p className="text-slate-500">You haven't posted any jobs yet.</p>
      ) : (
        <>
          <select
            value={selectedJobId ?? ''}
            onChange={(e) => setSelectedJobId(Number(e.target.value))}
            className="border border-slate-300 rounded-lg px-3 py-2 mb-6"
          >
            {jobs.map((job) => (
              <option key={job.id} value={job.id}>{job.title}</option>
            ))}
          </select>

          {loading ? (
            <p className="text-slate-500">Loading applicants...</p>
          ) : applications.length === 0 ? (
            <p className="text-slate-500">No applicants for this job yet.</p>
          ) : (
            <div className="space-y-3">
              {applications.map((app) => (
                <div key={app.id} className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-slate-800">{app.applicant.fullName}</p>
                    <p className="text-sm text-slate-500">{app.applicant.email}</p>
                    {app.coverLetter && (
                      <p className="text-xs text-slate-400 mt-1 max-w-md line-clamp-2">{app.coverLetter}</p>
                    )}
                  </div>
                  <select
                    value={app.status}
                    onChange={(e) => updateStatus(app.id, e.target.value as ApplicationStatus)}
                    className="text-sm border border-slate-300 rounded-lg px-2 py-1.5"
                  >
                    {statusOptions.map((s) => (
                      <option key={s} value={s}>{s.replace('_', ' ')}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
