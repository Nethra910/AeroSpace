import api from "./api";

const getPublishedNews = () => api.get("/news/");
const getNewsById = (id) => api.get(`/news/${id}`);

const getAllNews = () => api.get("/admin/news/");
const createNews = (data) => api.post("/admin/news/", data);
const updateNews = (id, data) => api.put(`/admin/news/${id}`, data);
const deleteNews = (id) => api.delete(`/admin/news/${id}`);
const togglePublish = (id) => api.patch(`/admin/news/${id}/publish`);

export default {
  getPublishedNews,
  getNewsById,
  getAllNews,
  createNews,
  updateNews,
  deleteNews,
  togglePublish,
};
