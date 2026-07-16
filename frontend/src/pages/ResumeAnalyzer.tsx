import { ChangeEvent, useState } from 'react'
import api from '../api/axios'
import { ResumeAnalysis } from '../types'

export default function ResumeAnalyzer() {
  const [file, setFile] = useState<File | null>(null)
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] ?? null)
    setAnalysis(null)
    setError('')
  }

  const handleAnalyze = async () => {
    if (!file) return
    setLoading(true)
    setError('')
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await api.post('/resume/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setAnalysis(res.data)
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Could not analyze resume (check OpenAI API key on the backend)')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-800 mb-1">AI Resume Analyzer</h1>
      <p className="text-slate-500 mb-6">Upload your resume (PDF) to get an instant AI review</p>

      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <input type="file" accept="application/pdf" onChange={handleFileChange}
          className="block w-full text-sm text-slate-600 mb-4" />

        <button
          onClick={handleAnalyze}
          disabled={!file || loading}
          className="bg-brand-500 hover:bg-brand-600 text-white font-medium px-5 py-2.5 rounded-lg disabled:opacity-60"
        >
          {loading ? 'Analyzing...' : 'Analyze resume'}
        </button>

        {error && <p className="text-sm text-red-600 mt-4">{error}</p>}
      </div>

      {analysis && (
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 text-center">
            <p className="text-3xl font-bold text-brand-600">{analysis.resumeScore}%</p>
            <p className="text-sm text-slate-500">Resume Score</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-5 text-center">
            <p className="text-3xl font-bold text-emerald-600">{analysis.atsScore}%</p>
            <p className="text-sm text-slate-500">ATS Compatibility</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 col-span-2">
            <h3 className="font-semibold text-slate-800 mb-2">✔ Skills found</h3>
            <div className="flex flex-wrap gap-2">
              {analysis.skillsFound.map((s) => (
                <span key={s} className="text-xs px-2 py-1 bg-emerald-50 text-emerald-700 rounded-md">{s}</span>
              ))}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 col-span-2">
            <h3 className="font-semibold text-slate-800 mb-2">❌ Missing skills</h3>
            <div className="flex flex-wrap gap-2">
              {analysis.missingSkills.map((s) => (
                <span key={s} className="text-xs px-2 py-1 bg-red-50 text-red-700 rounded-md">{s}</span>
              ))}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 col-span-2">
            <h3 className="font-semibold text-slate-800 mb-2">Suggestions</h3>
            <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
              {analysis.suggestions.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
