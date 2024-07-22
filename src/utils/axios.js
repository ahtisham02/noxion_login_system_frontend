import axios from 'axios'
import { Navigate } from 'react-router'

const publicPaths = ["login", 'register', "logout"]

// Add a request interceptor
axios.interceptors.request.use(
    config => {
        const path = config.url.split("/").at(-1);
        if (publicPaths.includes(path)) {
            config.headers['Content-Type'] = 'application/json';
        }
        else {
            const token = localStorage.getItem("token")
            if (token) {
                config.headers['Authorization'] = 'token=' + token
            }
        }
        return config
    },
    error => {
        Promise.reject(error)
    }
)

axios.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        return Promise.reject(error?.response)
    }
)

export default axios