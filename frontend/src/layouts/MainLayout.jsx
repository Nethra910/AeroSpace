import { Outlet } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-950">
      <Header />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default MainLayout;
