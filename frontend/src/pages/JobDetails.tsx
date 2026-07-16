import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import { Job } from '../types'

export default function JobDetails() {
  const { id } = useParams()
  const { user } = useAuth()

  const [job, setJob] = useState<Job | null>(null)
  const [coverLetter, setCoverLetter] = useState('')
  const [applying, setApplying] = useState(false)
  const [applied, setApplied] = useState(false)
  const [message, setMessage] = useState('')
  const [generatingLetter, setGeneratingLetter] = useState(false)

  useEffect(() => {
    api.get(`/jobs/${id}`).then((res) => setJob(res.data))
  }, [id])

  const handleApply = async () => {
    setApplying(true)
    setMessage('')
    try {
      await api.post('/applications', { jobId: Number(id), coverLetter })
      setApplied(true)
      setMessage('Application submitted successfully!')
    } catch (err: any) {
      setMessage(err?.response?.data?.message || 'Could not submit application')
    } finally {
      setApplying(false)
    }
  }

  const handleGenerateCoverLetter = async () => {
    setGeneratingLetter(true)
    try {
      const res = await api.get(`/resume/cover-letter/${id}`)
      setCoverLetter(res.data)
    } catch (err: any) {
      setMessage(err?.response?.data?.message || 'Could not generate cover letter (check OpenAI API key)')
    } finally {
      setGeneratingLetter(false)
    }
  }

  if (!job) return <div className="max-w-3xl mx-auto px-4 py-8 text-slate-500">Loading...</div>

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <h1 className="text-2xl font-bold text-slate-800">{job.title}</h1>
        <p className="text-slate-500">{job.company?.name} · {job.location}</p>

        <div className="flex flex-wrap gap-2 mt-3 text-xs text-slate-600">
          {job.jobType && <span className="px-2 py-1 bg-slate-100 rounded-md">{job.jobType}</span>}
          {job.workMode && <span className="px-2 py-1 bg-slate-100 rounded-md">{job.workMode}</span>}
          {job.experienceRequired && <span className="px-2 py-1 bg-slate-100 rounded-md">{job.experienceRequired}</span>}
        </div>

        <p className="mt-5 text-slate-700 whitespace-pre-line">{job.description}</p>

        {job.requiredSkills && (
          <div className="mt-5">
            <h3 className="font-semibold text-slate-800 mb-2">Required skills</h3>
            <div className="flex flex-wrap gap-2">
              {job.requiredSkills.split(',').map((s) => (
                <span key={s} className="text-xs px-2 py-1 bg-brand-50 text-brand-700 rounded-md">
                  {s.trim()}
                </span>
              ))}
            </div>
          </div>
        )}

        {user?.role === 'JOB_SEEKER' && !applied && (
          <div className="mt-6 border-t border-slate-200 pt-5">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-slate-700">Cover letter (optional)</label>
              <button
                onClick={handleGenerateCoverLetter}
                disabled={generatingLetter}
                className="text-xs text-brand-600 font-medium hover:underline disabled:opacity-60"
              >
                {generatingLetter ? 'Generating...' : '✨ Generate with AI'}
              </button>
            </div>
            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              rows={6}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
              placeholder="Write or generate a cover letter for this job..."
            />

            <button
              onClick={handleApply}
              disabled={applying}
              className="mt-4 bg-brand-500 hover:bg-brand-600 text-white font-medium px-5 py-2.5 rounded-lg disabled:opacity-60"
            >
              {applying ? 'Submitting...' : 'Apply now'}
            </button>
          </div>
        )}

        {message && <p className="mt-4 text-sm text-slate-600">{message}</p>}
      </div>
    </div>
  )
}
