import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import authService from "../../services/authService";

function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(
    searchParams.get("session") === "expired"
      ? "Your session has expired. Please log in again."
      : "",
  );
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await authService.login(username, password);
      navigate("/admin/dashboard");
    } catch {
      setError("Invalid username or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page-grid relative flex min-h-screen items-center justify-center overflow-hidden bg-[#060A13] px-6 py-16 text-white">
      <div className="pointer-events-none absolute left-8 top-8 font-mono text-[10px] uppercase tracking-[0.25em] text-slate-600 md:left-12 md:top-12">
        ADMIN CONSOLE / AUTH GATE
      </div>
      <div className="pointer-events-none absolute bottom-8 right-8 text-right font-mono text-[10px] uppercase tracking-[0.25em] text-slate-600 md:bottom-12 md:right-12">
        NODE 07 / PRIVILEGED ACCESS
      </div>

      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-md border border-white/10 bg-[#111a26] p-8 shadow-2xl md:p-10"
      >
        <div className="mb-8 flex items-center justify-between border-b border-white/10 pb-5">
          <div>
            <p className="font-mono text-xs font-semibold tracking-[0.18em]">
              MANI <span className="text-cyan-400">/ AEROSPACE</span>
            </p>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-slate-500">
              Operations control
            </p>
          </div>
          <span className="h-2 w-2 rounded-full bg-[#f0a35b] shadow-[0_0_0_4px_rgba(240,163,91,0.12)]" />
        </div>

        <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#61d6d1]">
          Restricted terminal
        </p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight">Admin Login</h1>
        <p className="mt-3 text-sm leading-6 text-slate-400">
          Authenticate to manage the MANI Aerospace platform.
        </p>

        <label className="mt-8 block font-mono text-xs uppercase tracking-widest text-slate-400">Username</label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mt-2 w-full border border-white/10 bg-[#070b12] p-3"
          required
        />

        <label className="mt-5 block font-mono text-xs uppercase tracking-widest text-slate-400">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-2 w-full border border-white/10 bg-[#070b12] p-3"
          required
        />

        {error && (
          <p className="mt-4 border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-400">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-8 flex w-full items-center justify-between bg-[#f0a35b] p-3 font-semibold text-[#060A13] disabled:opacity-50"
        >
          <span>{loading ? "Logging in..." : "Login"}</span>
          <span aria-hidden="true">↗</span>
        </button>

        <p className="mt-6 border-t border-white/10 pt-5 font-mono text-[10px] uppercase tracking-wider text-slate-500">
          Authorized personnel only · All access attempts are logged
        </p>
      </form>
    </section>
  );
}

export default Login;
