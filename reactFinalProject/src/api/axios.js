import axios from 'axios'
import Cookies from 'js-cookie'

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL
})

// לפני כל בקשה — הוסף טוקן אוטומטית
API.interceptors.request.use((config) => {
    const token = Cookies.get('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export default API
