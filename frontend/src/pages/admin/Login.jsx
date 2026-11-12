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
    <section className="flex min-h-screen items-center justify-center bg-[#060A13] px-6 text-white">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-xl border border-white/10 bg-slate-900 p-8"
      >
        <h1 className="text-3xl font-bold">Admin Login</h1>

        <label className="mt-8 block text-sm">Username</label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mt-2 w-full rounded-md border border-white/10 bg-[#060A13] p-3"
          required
        />

        <label className="mt-5 block text-sm">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-2 w-full rounded-md border border-white/10 bg-[#060A13] p-3"
          required
        />

        {error && <p className="mt-4 text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-8 w-full rounded-md bg-[#3EE0FF] p-3 font-semibold text-[#060A13] disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </section>
  );
}

export default Login;
