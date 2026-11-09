import { Link } from "react-router-dom";
import authService from "../../services/authService";

function Dashboard() {
  const handleLogout = async () => {
    await authService.logout();
    window.location.href = "/admin/login";
  };

  return (
    <section className="min-h-screen bg-[#060A13] px-6 py-20 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="rounded-md border border-white/20 px-5 py-2 hover:border-cyan-400"
          >
            Logout
          </button>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <Link
            to="/admin/news"
            className="rounded-xl border border-white/10 bg-slate-900 p-8 hover:border-cyan-400"
          >
            <h2 className="text-xl font-semibold">Manage News</h2>
            <p className="mt-3 text-slate-400">
              Create, edit, and publish news.
            </p>
          </Link>

          <Link
            to="/admin/home"
            className="rounded-xl border border-white/10 bg-slate-900 p-8 hover:border-cyan-400"
          >
            <h2 className="text-xl font-semibold">Edit Home</h2>
            <p className="mt-3 text-slate-400">Update homepage content.</p>
          </Link>

          <Link
            to="/admin/mission"
            className="rounded-xl border border-white/10 bg-slate-900 p-8 hover:border-cyan-400"
          >
            <h2 className="text-xl font-semibold">Edit Mission</h2>
            <p className="mt-3 text-slate-400">Update mission content.</p>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Dashboard;
