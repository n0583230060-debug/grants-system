import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'
import SendRequest from './pages/SendRequest'
import ViewStatus from './pages/ViewStatus'
import ViewRequests from './pages/ViewRequests'
import RequestDetails from './pages/RequestDetails'
import AdminDashboard from './pages/AdminDashboard'
import Navbar from './components/Navbar'
const App = () => {
    return (
        <>
            <Navbar />

            <Routes>
                {/* דף ברירת מחדל — מנתב ל-login */}
                <Route path="/" element={<Navigate to="/login" />} />

                {/* דפים ציבוריים */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/sendRequest" element={<ProtectedRoute studentOnly><SendRequest /></ProtectedRoute>} />
                <Route path="/viewStatus" element={<ProtectedRoute studentOnly><ViewStatus /></ProtectedRoute>} />
                {/* דפים מוגנים — רק לסטודנטים */}
                <Route path="/dashboard" element={
                    <ProtectedRoute studentOnly>
                        <Dashboard />
                    </ProtectedRoute>
                } />

                <Route path="/admin/requests" element={
                    <ProtectedRoute adminOnly={true}>
                        <ViewRequests />
                    </ProtectedRoute>
                } />

                <Route path="/admin/requests/:id" element={
                    <ProtectedRoute adminOnly={true}>
                        <RequestDetails />
                    </ProtectedRoute>
                } />

                {/* דף מנהל — רק למנהלים */}
                <Route path="/admin" element={
                    <ProtectedRoute adminOnly={true}>
                        <AdminDashboard />
                    </ProtectedRoute>
                } />
            </Routes>
        </>
    )
}

export default App