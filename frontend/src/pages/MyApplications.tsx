import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import { JobApplication } from '../types'

const statusColor: Record<string, string> = {
  APPLIED: 'bg-slate-100 text-slate-700',
  SHORTLISTED: 'bg-blue-50 text-blue-700',
  INTERVIEW_SCHEDULED: 'bg-purple-50 text-purple-700',
  ACCEPTED: 'bg-emerald-50 text-emerald-700',
  REJECTED: 'bg-red-50 text-red-700',
}

export default function MyApplications() {
  const [applications, setApplications] = useState<JobApplication[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/applications/my').then((res) => {
      setApplications(res.data)
      setLoading(false)
    })
  }, [])

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">My Applications</h1>

      {loading ? (
        <p className="text-slate-500">Loading...</p>
      ) : applications.length === 0 ? (
        <p className="text-slate-500">You haven't applied to any jobs yet.</p>
      ) : (
        <div className="space-y-3">
          {applications.map((app) => (
            <div key={app.id} className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between">
              <div>
                <Link to={`/jobs/${app.job.id}`} className="font-semibold text-slate-800 hover:text-brand-600">
                  {app.job.title}
                </Link>
                <p className="text-sm text-slate-500">{app.job.company?.name}</p>
                <p className="text-xs text-slate-400 mt-1">
                  Applied {new Date(app.appliedAt).toLocaleDateString()}
                </p>
              </div>
              <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${statusColor[app.status]}`}>
                {app.status.replace('_', ' ')}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
