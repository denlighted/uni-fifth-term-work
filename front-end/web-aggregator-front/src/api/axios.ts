import axios from "axios";

const api = axios.create({
    baseURL: '/api',
    withCredentials: true,
})

let isRefreshing = false;
api.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        if (error.response.status === 401 && !originalRequest._retry ) {
            if (!isRefreshing) {
                isRefreshing = true;
                originalRequest._retry = true;
                try {
                    const response = await api.post('/auth/refresh', {}, {withCredentials: true});
                    return api.request(originalRequest);
                } catch (error) {
                    isRefreshing = false;
                    //window.location.href = "/auth/login";
                    return Promise.reject(error);
                }

            } else {
                return Promise.reject(error);
            }
        }
        return Promise.reject(error);
    }
);

export default api;