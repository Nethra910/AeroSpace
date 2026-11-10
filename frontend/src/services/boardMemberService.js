import api from "./api";

const getAllMembers = () => api.get("/admin/board-members/");

const getPublicMembers = () => api.get("/board-members/");

const createMember = (data) => api.post("/admin/board-members/", data);

const updateMember = (id, data) => api.put(`/admin/board-members/${id}`, data);

const deleteMember = (id) => api.delete(`/admin/board-members/${id}`);

const uploadImage = (file) => {
  const formData = new FormData();
  formData.append("file", file);

  return api.post("/admin/board-members/upload-image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

const boardMemberService = {
  getAllMembers,
  getPublicMembers,
  createMember,
  updateMember,
  deleteMember,
  uploadImage,
};

export default boardMemberService;
