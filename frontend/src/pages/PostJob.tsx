import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { JobType, WorkMode } from '../types'

export default function PostJob() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [jobType, setJobType] = useState<JobType>('FULL_TIME')
  const [workMode, setWorkMode] = useState<WorkMode>('ONSITE')
  const [location, setLocation] = useState('')
  const [minSalary, setMinSalary] = useState('')
  const [maxSalary, setMaxSalary] = useState('')
  const [experienceRequired, setExperienceRequired] = useState('')
  const [requiredSkills, setRequiredSkills] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await api.post('/jobs', {
        title,
        description,
        category,
        jobType,
        workMode,
        location,
        minSalary: minSalary ? Number(minSalary) : undefined,
        maxSalary: maxSalary ? Number(maxSalary) : undefined,
        experienceRequired,
        requiredSkills,
      })
      navigate(`/jobs/${res.data.id}`)
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Could not create job')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">Post a new job</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            required placeholder="Job title" value={title} onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-slate-300 rounded-lg px-3 py-2"
          />
          <textarea
            required placeholder="Job description" rows={5} value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-slate-300 rounded-lg px-3 py-2"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              placeholder="Category (e.g. Engineering)" value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border border-slate-300 rounded-lg px-3 py-2"
            />
            <input
              placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)}
              className="border border-slate-300 rounded-lg px-3 py-2"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <select value={jobType} onChange={(e) => setJobType(e.target.value as JobType)}
              className="border border-slate-300 rounded-lg px-3 py-2">
              <option value="FULL_TIME">Full time</option>
              <option value="PART_TIME">Part time</option>
              <option value="INTERNSHIP">Internship</option>
              <option value="CONTRACT">Contract</option>
            </select>
            <select value={workMode} onChange={(e) => setWorkMode(e.target.value as WorkMode)}
              className="border border-slate-300 rounded-lg px-3 py-2">
              <option value="ONSITE">Onsite</option>
              <option value="HYBRID">Hybrid</option>
              <option value="REMOTE">Remote</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="number" placeholder="Min salary" value={minSalary}
              onChange={(e) => setMinSalary(e.target.value)}
              className="border border-slate-300 rounded-lg px-3 py-2"
            />
            <input
              type="number" placeholder="Max salary" value={maxSalary}
              onChange={(e) => setMaxSalary(e.target.value)}
              className="border border-slate-300 rounded-lg px-3 py-2"
            />
          </div>
          <input
            placeholder="Experience required (e.g. 2+ years)" value={experienceRequired}
            onChange={(e) => setExperienceRequired(e.target.value)}
            className="w-full border border-slate-300 rounded-lg px-3 py-2"
          />
          <input
            placeholder="Required skills, comma separated (e.g. Java, Spring Boot, React)"
            value={requiredSkills} onChange={(e) => setRequiredSkills(e.target.value)}
            className="w-full border border-slate-300 rounded-lg px-3 py-2"
          />

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit" disabled={loading}
            className="w-full bg-brand-500 hover:bg-brand-600 text-white font-medium py-2.5 rounded-lg disabled:opacity-60"
          >
            {loading ? 'Publishing...' : 'Publish job'}
          </button>
        </form>
      </div>
    </div>
  )
}
