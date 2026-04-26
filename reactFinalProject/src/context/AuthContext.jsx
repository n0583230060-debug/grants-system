import { createContext, useContext, useState, useEffect } from 'react'
import Cookies from 'js-cookie'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // בכניסה לאפליקציה — בדוק אם יש משתמש שמור בcookies
        const savedUser = Cookies.get('user')
        if (savedUser) {
            setUser(JSON.parse(savedUser))
        }
        setLoading(false)
    }, [])

    const login = (userData, token) => {
        if (token) Cookies.set('token', token, { expires: 7 })
        Cookies.set('user', JSON.stringify(userData), { expires: 7 })
        setUser(userData)
    }

    const logout = () => {
        Cookies.remove('token')
        Cookies.remove('user')
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
