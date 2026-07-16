import { Link } from 'react-router-dom'
import { Job } from '../types'

export default function JobCard({ job, matchScore }: { job: Job; matchScore?: number }) {
  return (
    <Link
      to={`/jobs/${job.id}`}
      className="block bg-white border border-slate-200 rounded-xl p-5 hover:border-brand-400 hover:shadow-sm transition"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-slate-800">{job.title}</h3>
          <p className="text-sm text-slate-500">{job.company?.name}</p>
        </div>
        {typeof matchScore === 'number' && (
          <span className="text-xs font-semibold px-2 py-1 rounded-full bg-emerald-50 text-emerald-700">
            {Math.round(matchScore)}% match
          </span>
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
        {job.location && <span className="px-2 py-1 bg-slate-50 rounded-md">{job.location}</span>}
        {job.workMode && <span className="px-2 py-1 bg-slate-50 rounded-md">{job.workMode}</span>}
        {job.jobType && <span className="px-2 py-1 bg-slate-50 rounded-md">{job.jobType}</span>}
        {job.minSalary && job.maxSalary && (
          <span className="px-2 py-1 bg-slate-50 rounded-md">
            {job.minSalary} - {job.maxSalary}
          </span>
        )}
      </div>
    </Link>
  )
}
