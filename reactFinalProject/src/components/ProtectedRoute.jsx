import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ProtectedRoute = ({ children, adminOnly = false, studentOnly = false }) => {
    const { user, loading } = useAuth()

    if (loading) return null
    if (!user) return <Navigate to="/login" />
    if (adminOnly && user.role !== 'admin') return <Navigate to="/dashboard" />
    if (studentOnly && user.role === 'admin') return <Navigate to="/admin/requests" />

    return children
}

export default ProtectedRoute
