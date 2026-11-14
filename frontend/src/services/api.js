import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Decides whether a request must carry the ADMIN token (vs. the regular user token).
// Most admin endpoints live under /admin/, but a few admin-only backend routes do not:
//   PUT /content/home, PUT /content/mission  (homepage / mission editors)
//   GET /auth/me, POST /auth/logout
const WRITE_METHODS = ["post", "put", "patch", "delete"];

const isAdminRequest = (config) => {
  const url = config?.url ?? "";
  const method = (config?.method ?? "get").toLowerCase();

  if (url.includes("/admin/")) return true;
  if (/^\/auth\/(me|logout)/.test(url)) return true;
  return /^\/content\//.test(url) && WRITE_METHODS.includes(method);
};

api.interceptors.request.use((config) => {
  const isAdminRoute = isAdminRequest(config);

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
    const isAdminRoute = isAdminRequest(error.config);

    if (error.response?.status === 401 && isAdminRoute) {
      localStorage.removeItem("admin_token");

      window.location.href = "/admin/login?session=expired";
    }

    return Promise.reject(error);
  },
);
export default api;
