import { Link } from "react-router-dom";
import authService from "../../services/authService";
import { adminPage, adminTitle } from "../../components/ui/pageStyles";

function Dashboard() {
  const handleLogout = async () => {
    await authService.logout();
    window.location.href = "/admin/login";
  };

  return (
    <section className={adminPage}>
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between">
          <h1 className={adminTitle}>Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="rounded-md border border-white/20 px-5 py-2 hover:border-signal"
          >
            Logout
          </button>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <Link
            to="/admin/news"
            className="rounded-xl border border-white/10 bg-space-800 p-8 hover:border-signal"
          >
            <h2 className="text-xl font-semibold">Manage News</h2>
            <p className="mt-3 text-muted">
              Create, edit, and publish news.
            </p>
          </Link>

          <Link
            to="/admin/home"
            className="rounded-xl border border-white/10 bg-space-800 p-8 hover:border-signal"
          >
            <h2 className="text-xl font-semibold">Edit Home</h2>
            <p className="mt-3 text-muted">Update homepage content.</p>
          </Link>

          <Link
            to="/admin/mission"
            className="rounded-xl border border-white/10 bg-space-800 p-8 hover:border-signal"
          >
            <h2 className="text-xl font-semibold">Edit Mission</h2>
            <p className="mt-3 text-muted">Update mission content.</p>
          </Link>

          <Link
            to="/admin/team"
            className="rounded-xl border border-white/10 bg-space-800 p-8 hover:border-signal"
          >
            <h2 className="text-xl font-semibold">Manage Team SIMHA</h2>
            <p className="mt-3 text-muted">
              Add, edit, and manage team members.
            </p>
          </Link>

          <Link
            to="/admin/board-members"
            className="rounded-xl border border-white/10 bg-space-800 p-8 hover:border-signal"
          >
            <h2 className="text-xl font-semibold">Manage Board Members</h2>
            <p className="mt-3 text-muted">
              Add, edit, and manage board member profiles.
            </p>
          </Link>
          <Link
            to="/admin/research-papers"
            className="rounded-xl border border-white/10 bg-space-800 p-8 hover:border-signal"
          >
            <h2 className="text-xl font-semibold text-white">
              Research Papers
            </h2>

            <p className="mt-3 text-muted">
              Publish your own research papers instantly, review user
              submissions, and manage published papers.
            </p>

            <span className="mt-4 inline-block text-signal">
              Manage Papers →
            </span>
          </Link>
          <Link
            to="/admin/research-papers/publish"
            className="rounded-xl border border-white/10 bg-space-800 p-8 hover:border-signal"
          >
            <h2 className="text-xl font-semibold">Publish Research Paper</h2>
            <p className="mt-3 text-muted">
              Submit and publish research papers directly as admin.
            </p>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Dashboard;
