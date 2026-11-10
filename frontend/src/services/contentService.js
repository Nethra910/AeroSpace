import api from "./api";

const getHomeContent = () => api.get("/content/home");
const updateHomeContent = (data) => api.put("/content/home", data);

const getMissionContent = () => api.get("/content/mission");
const updateMissionContent = (data) => api.put("/content/mission", data);

export default {
  getHomeContent,
  updateHomeContent,
  getMissionContent,
  updateMissionContent,
};
