import axios from "axios";

const api = axios.create({
baseURL:
import.meta.env.VITE_BASE_URL ||
"https://sundigo.sundigosewasamiti.in/api",
});

// Request Interceptor
api.interceptors.request.use(
(config) => {
const token = localStorage.getItem("token");

if (token) {
  config.headers.Authorization = `Bearer ${token}`;
}

return config;

},
(error) => Promise.reject(error)
);

export default api;