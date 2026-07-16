import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Role } from '../types'

export default function PrivateRoute({
  children,
  allowedRoles,
}: {
  children: JSX.Element
  allowedRoles?: Role[]
}) {
  const { user } = useAuth()

  if (!user) return <Navigate to="/login" replace />

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />
  }

  return children
}
