import api from "./api";

const login = async (username, password) => {
  const formData = new URLSearchParams();
  formData.append("username", username);
  formData.append("password", password);

  const response = await api.post("/auth/login", formData, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  localStorage.setItem("admin_token", response.data.access_token);
  return response.data;
};

const getCurrentAdmin = () => api.get("/auth/me");

const logout = async () => {
  try {
    await api.post("/auth/logout");
  } finally {
    localStorage.removeItem("admin_token");
  }
};

export default { login, getCurrentAdmin, logout };
