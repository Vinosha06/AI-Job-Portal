import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import PrivateRoute from './components/PrivateRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import JobList from './pages/JobList'
import JobDetails from './pages/JobDetails'
import RecommendedJobs from './pages/RecommendedJobs'
import MyApplications from './pages/MyApplications'
import PostJob from './pages/PostJob'
import RecruiterApplicants from './pages/RecruiterApplicants'
import ResumeAnalyzer from './pages/ResumeAnalyzer'
import Notifications from './pages/Notifications'
import AdminDashboard from './pages/AdminDashboard'

export default function App() {
  return (
    <div className="min-h-screen">
      <Navbar />

      <Routes>
        <Route path="/" element={<JobList />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/recommended"
          element={
            <PrivateRoute allowedRoles={['JOB_SEEKER']}>
              <RecommendedJobs />
            </PrivateRoute>
          }
        />
        <Route
          path="/my-applications"
          element={
            <PrivateRoute allowedRoles={['JOB_SEEKER']}>
              <MyApplications />
            </PrivateRoute>
          }
        />
        <Route
          path="/resume-analyzer"
          element={
            <PrivateRoute allowedRoles={['JOB_SEEKER']}>
              <ResumeAnalyzer />
            </PrivateRoute>
          }
        />

        <Route
          path="/post-job"
          element={
            <PrivateRoute allowedRoles={['RECRUITER']}>
              <PostJob />
            </PrivateRoute>
          }
        />
        <Route
          path="/recruiter/applicants"
          element={
            <PrivateRoute allowedRoles={['RECRUITER']}>
              <RecruiterApplicants />
            </PrivateRoute>
          }
        />

        <Route
          path="/notifications"
          element={
            <PrivateRoute>
              <Notifications />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <PrivateRoute allowedRoles={['ADMIN']}>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </div>
  )
}
