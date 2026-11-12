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
import ResearchPaperDetails from "../pages/ResearchPaperDetails";
import Simulation from "../pages/Simulation";
import NewsDetails from "../pages/NewsDetails";
import TeamManagement from "../pages/admin/TeamManagement";
import BoardMemberManagement from "../pages/admin/BoardMemberManagement";
import UserLogin from "../pages/auth/UserLogin";
import UserProfile from "../pages/auth/UserProfile";
import SubmitResearchPaper from "../pages/SubmitResearchPaper";
import MySubmissions from "../pages/MySubmissions";
import ResearchPaperManagement from "../pages/admin/ResearchPaperManagement";
import AdminSubmitResearchPaper from "../pages/admin/AdminSubmitResearchPaper";
function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/mission" element={<Mission />} />
        <Route path="/news" element={<News />} />
        <Route path="/news/:id" element={<NewsDetails />} />
        <Route path="/vision-2036" element={<Vision2036 />} />
        <Route path="/team-simha" element={<TeamSimha />} />
        <Route path="/directors" element={<Directors />} />
        <Route path="/parent-company" element={<ParentCompany />} />
        <Route path="/research" element={<Research />} />

        <Route path="/published-papers" element={<PublishedPapers />} />
        <Route
          path="/published-papers/:paperId"
          element={<ResearchPaperDetails />}
        />
        <Route
          path="/submit-research-paper"
          element={<SubmitResearchPaper />}
        />
        <Route path="/my-submissions" element={<MySubmissions />} />

        <Route path="/simulation" element={<Simulation />} />
        <Route path="/profile" element={<UserProfile />} />
      </Route>

      <Route path="/login" element={<UserLogin />} />
      <Route path="/admin/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/news" element={<NewsManagement />} />
        <Route path="/admin/home" element={<HomeEditor />} />
        <Route path="/admin/mission" element={<MissionEditor />} />
        <Route path="/admin/team" element={<TeamManagement />} />
        <Route
          path="/admin/board-members"
          element={<BoardMemberManagement />}
        />
        <Route
          path="/admin/research-papers"
          element={<ResearchPaperManagement />}
        />
      </Route>
      <Route
        path="/admin/research-papers/publish"
        element={<AdminSubmitResearchPaper />}
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
