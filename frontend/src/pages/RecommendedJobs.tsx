import { useEffect, useState } from 'react'
import api from '../api/axios'
import JobCard from '../components/JobCard'
import { Job } from '../types'

export default function RecommendedJobs() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/jobs/recommended').then((res) => {
      setJobs(res.data)
      setLoading(false)
    })
  }, [])

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-800 mb-1">Recommended for you</h1>
      <p className="text-slate-500 mb-6">Ranked by how well your skills match each job</p>

      {loading ? (
        <p className="text-slate-500">Finding your best matches...</p>
      ) : jobs.length === 0 ? (
        <p className="text-slate-500">
          No recommendations yet — add skills to your profile or upload a resume first.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  )
}
