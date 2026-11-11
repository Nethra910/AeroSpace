import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const isAdminRoute = config.url?.includes("/admin/");

  const token = isAdminRoute
    ? localStorage.getItem("admin_token")
    : localStorage.getItem("user_access_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAdminRoute = error.config?.url?.includes("/admin/");

    if (error.response?.status === 401 && isAdminRoute) {
      localStorage.removeItem("admin_token");

      window.location.href = "/admin/login?session=expired";
    }

    return Promise.reject(error);
  },
);
export default api;
