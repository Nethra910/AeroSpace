import api from "./api";

const getActiveMembers = () => api.get("/team-members/");
const getMemberById = (id) => api.get(`/team-members/${id}`);

const getAllMembers = () => api.get("/admin/team-members/");
const createMember = (data) => api.post("/admin/team-members/", data);
const updateMember = (id, data) => api.put(`/admin/team-members/${id}`, data);
const deleteMember = (id) => api.delete(`/admin/team-members/${id}`);
const toggleStatus = (id) => api.patch(`/admin/team-members/${id}/status`);

const uploadImage = (file) => {
  const formData = new FormData();
  formData.append("file", file);

  return api.post("/admin/team-members/upload-image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export default {
  getActiveMembers,
  getMemberById,
  getAllMembers,
  createMember,
  updateMember,
  deleteMember,
  toggleStatus,
  uploadImage,
};
