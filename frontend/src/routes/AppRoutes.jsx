import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import Mission from "../pages/Mission";
import News from "../pages/News";
import NotFound from "../pages/NotFound";
import Login from "../pages/admin/Login";
import Dashboard from "../pages/admin/Dashboard";
import ProtectedRoute from "../components/layout/ProtectedRoute";
import NewsManagement from "../pages/admin/NewsManagement";
import HomeEditor from "../pages/admin/HomeEditor";
import MissionEditor from "../pages/admin/MissionEditor";
import Vision2036 from "../pages/Vision2036";
import TeamSimha from "../pages/TeamSimha";
import Directors from "../pages/Directors";
import ParentCompany from "../pages/ParentCompany";
import Research from "../pages/Research";
import PublishedPapers from "../pages/PublishedPapers";
import Simulation from "../pages/Simulation";

function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/mission" element={<Mission />} />
        <Route path="/news" element={<News />} />
        <Route path="/vision-2036" element={<Vision2036 />} />
        <Route path="/team-simha" element={<TeamSimha />} />
        <Route path="/directors" element={<Directors />} />
        <Route path="/parent-company" element={<ParentCompany />} />
        <Route path="/research" element={<Research />} />
        <Route path="/published-papers" element={<PublishedPapers />} />
        <Route path="/simulation" element={<Simulation />} />
      </Route>

      <Route path="/admin/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/news" element={<NewsManagement />} />
        <Route path="/admin/home" element={<HomeEditor />} />
        <Route path="/admin/mission" element={<MissionEditor />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
