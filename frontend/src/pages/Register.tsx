import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Role } from '../types'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<Role>('JOB_SEEKER')
  const [companyName, setCompanyName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register({ fullName, email, password, role, companyName: role === 'RECRUITER' ? companyName : undefined })
      navigate('/')
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-12 bg-white border border-slate-200 rounded-xl p-8">
      <h1 className="text-2xl font-bold text-slate-800 mb-1">Create your account</h1>
      <p className="text-sm text-slate-500 mb-6">Join as a job seeker or a recruiter</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setRole('JOB_SEEKER')}
            className={`py-2 rounded-lg text-sm font-medium border ${
              role === 'JOB_SEEKER' ? 'bg-brand-500 text-white border-brand-500' : 'border-slate-300 text-slate-600'
            }`}
          >
            Job Seeker
          </button>
          <button
            type="button"
            onClick={() => setRole('RECRUITER')}
            className={`py-2 rounded-lg text-sm font-medium border ${
              role === 'RECRUITER' ? 'bg-brand-500 text-white border-brand-500' : 'border-slate-300 text-slate-600'
            }`}
          >
            Recruiter
          </button>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Full name</label>
          <input
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Password</label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        {role === 'RECRUITER' && (
          <div>
            <label className="text-sm font-medium text-slate-700">Company name</label>
            <input
              required
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand-500 hover:bg-brand-600 text-white font-medium py-2.5 rounded-lg disabled:opacity-60"
        >
          {loading ? 'Creating account...' : 'Create account'}
        </button>
      </form>

      <p className="text-sm text-slate-500 mt-6 text-center">
        Already have an account?{' '}
        <Link to="/login" className="text-brand-600 font-medium">
          Log in
        </Link>
      </p>
    </div>
  )
}
