import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg text-brand-700">
          <span className="w-8 h-8 rounded-lg bg-brand-500 text-white flex items-center justify-center">
            AI
          </span>
          JobPortal
        </Link>

        <div className="flex items-center gap-6 text-sm font-medium text-slate-600">
          <Link to="/" className="hover:text-brand-600">Jobs</Link>

          {user?.role === 'JOB_SEEKER' && (
            <>
              <Link to="/recommended" className="hover:text-brand-600">Recommended</Link>
              <Link to="/my-applications" className="hover:text-brand-600">My Applications</Link>
              <Link to="/resume-analyzer" className="hover:text-brand-600">Resume Analyzer</Link>
            </>
          )}

          {user?.role === 'RECRUITER' && (
            <>
              <Link to="/post-job" className="hover:text-brand-600">Post a Job</Link>
              <Link to="/recruiter/applicants" className="hover:text-brand-600">Applicants</Link>
            </>
          )}

          {user?.role === 'ADMIN' && (
            <Link to="/admin" className="hover:text-brand-600">Admin</Link>
          )}

          {user && (
            <Link to="/notifications" className="hover:text-brand-600">Notifications</Link>
          )}

          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-slate-500">Hi, {user.fullName.split(' ')[0]}</span>
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="hover:text-brand-600">Login</Link>
              <Link
                to="/register"
                className="px-3 py-1.5 rounded-md bg-brand-500 text-white hover:bg-brand-600"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
