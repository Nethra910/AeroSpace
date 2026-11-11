import api from "./api";

export const getPublishedPapers = async (params = {}) => {
  const response = await api.get("/research-papers/", { params });
  return response.data;
};

export const likePaper = async (paperId) => {
  const response = await api.post(`/research-papers/${paperId}/like`);
  return response.data;
};

export const unlikePaper = async (paperId) => {
  const response = await api.delete(`/research-papers/${paperId}/like`);
  return response.data;
};

export const getPaperComments = async (paperId) => {
  const response = await api.get(`/research-papers/${paperId}/comments`);
  return response.data;
};

export const getPublishedPaper = async (paperId) => {
  const response = await api.get(`/research-papers/${paperId}`);
  return response.data;
};

export const addPaperComment = async (paperId, comment, isAdmin = false) => {
  const endpoint = isAdmin
    ? `/admin/research-papers/${paperId}/comments`
    : `/research-papers/${paperId}/comments`;

  const response = await api.post(endpoint, { comment });
  return response.data;
};

export const uploadResearchPaperPdf = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post("/research-papers/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};
export const submitResearchPaper = async (paperData) => {
  const response = await api.post("/research-papers/", paperData);

  return response.data;
};

export const getMySubmissions = async () => {
  const response = await api.get("/research-papers/my-submissions");
  return response.data;
};

export const getPendingResearchPapers = async () => {
  const response = await api.get("/admin/research-papers/pending");
  return response.data;
};

export const reviewResearchPaper = async (
  paperId,
  status,
  rejectionReason = null,
) => {
  const response = await api.patch(`/admin/research-papers/${paperId}/review`, {
    status,
    rejection_reason: rejectionReason,
  });

  return response.data;
};

export const getAllResearchPapers = async () => {
  const response = await api.get("/admin/research-papers/");
  return response.data;
};

export const deleteResearchPaper = async (paperId) => {
  const response = await api.delete(`/admin/research-papers/${paperId}`);

  return response.data;
};
