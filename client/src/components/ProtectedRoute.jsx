import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

// Requires: any authenticated user
export function ProtectedRoute({ children }) {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) {
    // Preserve where the user was trying to go — LoginPage reads this
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  return children
}

// Requires: authenticated + staff role
export function StaffRoute({ children }) {
  const { user, isStaff } = useAuth()
  const location = useLocation()

  if (!user)     return <Navigate to="/login" state={{ from: location }} replace />
  if (!isStaff)  return <Navigate to="/" replace />
  return children
}