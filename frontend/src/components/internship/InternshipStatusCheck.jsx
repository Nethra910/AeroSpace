// src/components/internship/InternshipStatusCheck.jsx
// "Check Application Status" panel. The applicant enters their Application ID or email;
// only id / track / status / date come back (no personal data is ever exposed).
import { useState } from "react";
import { checkStatus } from "../../services/internshipApi";

const STATUS_INFO = {
  Pending: {
    label: "Pending",
    style: "border-warm text-warm",
    text: "Your application is under review.",
  },
  Selected: {
    label: "Approved / Selected",
    style: "border-success text-success",
    text: "Congratulations! You have been selected. Our team will contact you by email.",
  },
  Rejected: {
    label: "Rejected",
    style: "border-danger text-danger",
    text: "Thank you for applying. We are unable to offer you a place this time.",
  },
};

function InternshipStatusCheck() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState(null); // null = not searched yet, [] = nothing found

  const handleSubmit = async (e) => {
    e.preventDefault();
    const q = query.trim();
    if (q.length < 5) {
      setError("Enter your Application ID (e.g. INT-1A2B3C4D) or your email.");
      return;
    }
    setError("");
    setResults(null);
    try {
      setLoading(true);
      setResults(await checkStatus(q));
    } catch (err) {
      setError(err.message || "Unable to check status. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-16 rounded-2xl border border-white/10 bg-space-800 p-8">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-signal">
        Already applied?
      </p>
      <h2 className="mt-3 text-2xl font-semibold">Check Application Status</h2>

      <form
        onSubmit={handleSubmit}
        className="mt-6 flex flex-col gap-3 sm:flex-row"
      >
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Application ID or email"
          aria-label="Application ID or email"
          className="rounded-lg border border-white/10 bg-space-950 px-4 py-3 text-white outline-none focus:border-signal"
        />
        <button
          type="submit"
          disabled={loading}
          className="shrink-0 rounded-lg bg-signal px-6 py-3 font-bold text-space-950 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Checking..." : "Check Status"}
        </button>
      </form>

      {error && (
        <p
          role="alert"
          className="mt-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-400"
        >
          {error}
        </p>
      )}

      {results && results.length === 0 && (
        <p className="mt-4 text-sm text-muted">
          No application found. Check the ID or use the email you applied with.
        </p>
      )}

      {results && results.length > 0 && (
        <div className="mt-6 grid gap-3">
          {results.map((r) => {
            const info = STATUS_INFO[r.status] || {
              label: r.status,
              style: "border-white/20 text-muted",
              text: "",
            };
            return (
              <div
                key={r.id}
                className="rounded-lg border border-white/10 bg-space-950 p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-mono text-sm text-signal">{r.id}</p>
                    <p className="mt-1 text-sm text-muted">
                      {r.track} · Applied{" "}
                      {new Date(r.submitted).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`rounded border px-2 py-1 font-mono text-xs uppercase tracking-widest ${info.style}`}
                  >
                    {info.label}
                  </span>
                </div>
                {info.text && (
                  <p className="mt-3 text-sm text-muted">{info.text}</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default InternshipStatusCheck;
