import { useEffect, useState } from 'react'
import api from '../api/axios'
import JobCard from '../components/JobCard'
import { Job, JobType, WorkMode } from '../types'

export default function JobList() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [keyword, setKeyword] = useState('')
  const [location, setLocation] = useState('')
  const [workMode, setWorkMode] = useState<WorkMode | ''>('')
  const [jobType, setJobType] = useState<JobType | ''>('')

  const fetchJobs = async () => {
    setLoading(true)
    const params: Record<string, string> = {}
    if (keyword) params.keyword = keyword
    if (location) params.location = location
    if (workMode) params.workMode = workMode
    if (jobType) params.jobType = jobType

    const res = await api.get('/jobs', { params })
    setJobs(res.data)
    setLoading(false)
  }

  useEffect(() => {
    fetchJobs()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchJobs()
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-800 mb-1">Find your next role</h1>
      <p className="text-slate-500 mb-6">AI-matched jobs across every category</p>

      <form onSubmit={handleSearch} className="bg-white border border-slate-200 rounded-xl p-4 mb-6 grid grid-cols-1 md:grid-cols-5 gap-3">
        <input
          placeholder="Keyword (e.g. Java)"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="border border-slate-300 rounded-lg px-3 py-2 md:col-span-2"
        />
        <input
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="border border-slate-300 rounded-lg px-3 py-2"
        />
        <select
          value={workMode}
          onChange={(e) => setWorkMode(e.target.value as WorkMode | '')}
          className="border border-slate-300 rounded-lg px-3 py-2"
        >
          <option value="">Any work mode</option>
          <option value="REMOTE">Remote</option>
          <option value="HYBRID">Hybrid</option>
          <option value="ONSITE">Onsite</option>
        </select>
        <select
          value={jobType}
          onChange={(e) => setJobType(e.target.value as JobType | '')}
          className="border border-slate-300 rounded-lg px-3 py-2"
        >
          <option value="">Any job type</option>
          <option value="FULL_TIME">Full time</option>
          <option value="PART_TIME">Part time</option>
          <option value="INTERNSHIP">Internship</option>
          <option value="CONTRACT">Contract</option>
        </select>
        <button
          type="submit"
          className="md:col-span-5 bg-brand-500 hover:bg-brand-600 text-white font-medium py-2.5 rounded-lg"
        >
          Search
        </button>
      </form>

      {loading ? (
        <p className="text-slate-500">Loading jobs...</p>
      ) : jobs.length === 0 ? (
        <p className="text-slate-500">No jobs found. Try a different search.</p>
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
