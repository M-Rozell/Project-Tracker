// api.js
import axios from "axios";

const api = axios.create({
    baseURL: "http://127.0.0.1:8000", // Adjust to match your FastAPI server
});

// Attach access token to all requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("access_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Intercept 401s to auto-refresh token
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem("refresh_token");
                const formData = new URLSearchParams();
                formData.append("refresh_token", refreshToken);

                const res = await axios.post("http://127.0.0.1:8000/refresh", formData, {
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                });

                localStorage.setItem("access_token", res.data.access_token);
                originalRequest.headers["Authorization"] = `Bearer ${res.data.access_token}`;
                return api(originalRequest);
            } catch (refreshError) {
                // If refresh fails, force logout
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
                window.location.href = "/login"; // Redirect to login page
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
