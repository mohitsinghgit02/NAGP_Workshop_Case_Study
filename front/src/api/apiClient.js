import axios from "axios";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 15000,
    headers: {
        "Content-Type": "application/json",
    },
});

// 🔐 Attach token automatically (if available)
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("access_token");
        const idToken = localStorage.getItem("id_token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        if (idToken) {
            config.headers["X-Id-Token"] = idToken;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// ❌ Global error handling (optional but recommended)
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.clear();
            window.location.reload();
        }
        return Promise.reject(error);
    }
);

export default apiClient;
