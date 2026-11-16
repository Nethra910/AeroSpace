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

// Builds the exact payload ResearchPaperCreate expects.
// `uploadResponse` is the { pdf_url, public_id } object returned by the upload endpoints.
export const buildResearchPaperPayload = (formData, uploadResponse) => {
  if (!uploadResponse?.pdf_url || !uploadResponse?.public_id) {
    throw new Error("PDF upload did not return a file URL and public id.");
  }

  return {
    title: formData.title.trim(),
    abstract: formData.abstract.trim(),
    authors: formData.authors.trim(),
    affiliation: formData.affiliation.trim() || null,
    keywords: formData.keywords.trim() || null,
    pdf_url: uploadResponse.pdf_url,
    cloudinary_public_id: uploadResponse.public_id,
  };
};

// FastAPI returns `detail` as a string for HTTPException but as an ARRAY of
// objects for 422 validation errors. Rendering that array in JSX crashes React.
export const getApiErrorMessage = (err, fallback) => {
  const detail = err?.response?.data?.detail;

  if (typeof detail === "string") return detail;

  if (Array.isArray(detail)) {
    return detail
      .map((d) => {
        const field = Array.isArray(d.loc) ? d.loc[d.loc.length - 1] : "";
        return field ? `${field}: ${d.msg}` : d.msg;
      })
      .join("; ");
  }

  return err?.message && !err?.response ? err.message : fallback;
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

export const uploadAdminResearchPaperPdf = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post("/admin/research-papers/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const submitAdminResearchPaper = async (paperData) => {
  const response = await api.post("/admin/research-papers/", paperData);

  return response.data;
};
