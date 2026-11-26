// src/pages/admin/InternshipManagement.jsx
// Admin view of internship applicants stored in Google Sheets.
// - Search + status filter (All / Pending / Selected / Rejected)
// - Expand a card to see full details
// - Mark Selected / Rejected -> written back to the exact Sheet row (matched by ID)
//
// Access to the Sheet is guarded by ADMIN_KEY (Apps Script property). The admin types it once;
// it is kept in sessionStorage only (cleared when the tab closes), never bundled into the app.
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  fetchApplications,
  updateApplicationStatus,
  deleteApplication,
} from "../../services/internshipApi";
import { adminPage, adminTitle } from "../../components/ui/pageStyles";

const KEY_STORAGE = "internship_admin_key";
const FILTERS = ["All", "Pending", "Selected", "Rejected"];

const STATUS_STYLE = {
  Pending: "border-warm text-warm",
  Selected: "border-success text-success",
  Rejected: "border-danger text-danger",
};

const getStoredKey = () => {
  try {
    return sessionStorage.getItem(KEY_STORAGE) || "";
  } catch {
    return "";
  }
};

function StatusBadge({ status }) {
  return (
    <span
      className={`rounded border px-2 py-1 font-mono text-xs uppercase tracking-widest ${STATUS_STYLE[status] || "border-white/20 text-muted"}`}
    >
      {status}
    </span>
  );
}

// One label/value row in the details panel
function Detail({ label, children }) {
  return (
    <div>
      <p className="font-mono text-xs uppercase tracking-widest text-quiet">
        {label}
      </p>
      <p className="mt-1 break-words text-sm">{children || "—"}</p>
    </div>
  );
}

function InternshipManagement() {
  const [adminKey, setAdminKey] = useState(getStoredKey);
  const [keyInput, setKeyInput] = useState("");
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null); // row awaiting delete confirmation

  const signOut = useCallback((message = "") => {
    try {
      sessionStorage.removeItem(KEY_STORAGE);
    } catch {
      /* storage unavailable */
    }
    setAdminKey("");
    setApplications([]);
    setError(message);
  }, []);

  const load = useCallback(async () => {
    if (!adminKey) return;
    setLoading(true);
    setError("");
    try {
      setApplications(await fetchApplications(adminKey));
    } catch (err) {
      if (err.message === "Unauthorized")
        signOut("Incorrect admin key. Please try again.");
      else setError(err.message || "Unable to load applications.");
    } finally {
      setLoading(false);
    }
  }, [adminKey, signOut]);

  useEffect(() => {
    load();
  }, [load]);

  const handleUnlock = (e) => {
    e.preventDefault();
    const key = keyInput.trim();
    if (!key) return;
    try {
      sessionStorage.setItem(KEY_STORAGE, key);
    } catch {
      /* storage unavailable */
    }
    setKeyInput("");
    setAdminKey(key);
  };

  const handleStatus = async (app, status) => {
    if (app.Status === status) return;
    setUpdatingId(app.ID);
    setError("");
    try {
      await updateApplicationStatus(app.ID, status, adminKey);
      // Update locally so the UI stays instant; the Sheet is already saved.
      setApplications((list) =>
        list.map((a) => (a.ID === app.ID ? { ...a, Status: status } : a)),
      );
    } catch (err) {
      if (err.message === "Unauthorized")
        signOut("Admin key rejected. Please re-enter it.");
      else setError(err.message || "Unable to update status.");
    } finally {
      setUpdatingId(null);
    }
  };

  // Permanently removes the row from the Sheet, then refreshes the list from the Sheet.
  const handleDelete = async (app) => {
    setUpdatingId(app.ID);
    setError("");
    try {
      await deleteApplication(app.ID, adminKey);
      setConfirmDeleteId(null);
      setExpandedId(null);
      await load();
    } catch (err) {
      if (err.message === "Unauthorized")
        signOut("Admin key rejected. Please re-enter it.");
      else setError(err.message || "Unable to delete application.");
    } finally {
      setUpdatingId(null);
    }
  };

  const counts = useMemo(() => {
    const c = {
      All: applications.length,
      Pending: 0,
      Selected: 0,
      Rejected: 0,
    };
    applications.forEach((a) => {
      if (c[a.Status] !== undefined) c[a.Status] += 1;
    });
    return c;
  }, [applications]);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return applications.filter((a) => {
      if (filter !== "All" && a.Status !== filter) return false;
      if (!q) return true;
      return [a.FullName, a.Email, a.College, a.Track, a.ID].some((v) =>
        String(v).toLowerCase().includes(q),
      );
    });
  }, [applications, filter, search]);

  // ---- Locked state ----
  if (!adminKey) {
    return (
      <section className={adminPage}>
        <div className="mx-auto max-w-md">
          <h1 className={adminTitle}>Internship Applications</h1>
          <form
            onSubmit={handleUnlock}
            className="mt-10 grid gap-4 rounded-xl border border-white/10 bg-space-800 p-6"
          >
            <label className="grid gap-2 text-sm">
              Internship admin key
              <input
                type="password"
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                autoComplete="off"
                className="rounded-md border border-white/10 bg-space-950 p-3"
              />
            </label>
            {error && (
              <p role="alert" className="text-sm text-red-400">
                {error}
              </p>
            )}
            <button
              type="submit"
              className="rounded-md bg-signal px-6 py-3 font-semibold text-black"
            >
              Unlock
            </button>
          </form>
        </div>
      </section>
    );
  }

  // ---- Dashboard ----
  return (
    <section className={adminPage}>
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className={adminTitle}>Internship Applications</h1>
          <div className="flex gap-2">
            <button
              onClick={load}
              disabled={loading}
              className="rounded border border-signal px-3 py-2 text-signal disabled:opacity-50"
            >
              {loading ? "Refreshing..." : "Refresh"}
            </button>
            <button
              onClick={() => signOut()}
              className="rounded border border-white/20 px-3 py-2"
            >
              Lock
            </button>
          </div>
        </div>

        {error && (
          <p role="alert" className="mt-4 text-red-400">
            {error}
          </p>
        )}

        {/* Filter tabs + search */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded border px-3 py-2 text-sm ${filter === f ? "border-signal bg-signal/10 text-signal" : "border-white/20 text-muted"}`}
              >
                {f} <span className="font-mono text-xs">({counts[f]})</span>
              </button>
            ))}
          </div>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, college, track, ID"
            className="rounded-md border border-white/10 bg-space-950 p-3 md:max-w-sm"
          />
        </div>

        {/* List */}
        {loading && applications.length === 0 ? (
          <p className="mt-6 text-muted">Loading applications...</p>
        ) : visible.length === 0 ? (
          <p className="mt-6 text-muted">No applications match.</p>
        ) : (
          <div className="mt-6 grid gap-4">
            {visible.map((app) => {
              const open = expandedId === app.ID;
              const busy = updatingId === app.ID;
              return (
                <article
                  key={app.ID}
                  className="rounded-lg border border-white/10 bg-space-800 p-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <h3 className="font-semibold">{app.FullName}</h3>
                      <p className="mt-1 text-sm text-muted">
                        {app.Track} · {app.College} ·{" "}
                        {new Date(app.Timestamp).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge status={app.Status} />
                      <button
                        onClick={() => setExpandedId(open ? null : app.ID)}
                        className="rounded border border-white/20 px-3 py-2"
                        aria-expanded={open}
                      >
                        {open ? "Hide" : "Details"}
                      </button>
                      <button
                        onClick={() => handleStatus(app, "Selected")}
                        disabled={busy || app.Status === "Selected"}
                        className="rounded border border-success px-3 py-2 text-success disabled:opacity-40"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleStatus(app, "Rejected")}
                        disabled={busy || app.Status === "Rejected"}
                        className="rounded border border-red-400 px-3 py-2 text-red-400 disabled:opacity-40"
                      >
                        Reject
                      </button>
                      {confirmDeleteId === app.ID ? (
                        <>
                          <button
                            onClick={() => handleDelete(app)}
                            disabled={busy}
                            className="rounded bg-red-500 px-3 py-2 font-semibold text-black disabled:opacity-50"
                          >
                            {busy ? "Deleting..." : "Confirm delete"}
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(null)}
                            disabled={busy}
                            className="rounded border border-white/20 px-3 py-2"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => setConfirmDeleteId(app.ID)}
                          disabled={busy}
                          className="rounded border border-white/20 px-3 py-2 text-muted hover:border-red-400 hover:text-red-400 disabled:opacity-40"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>

                  {open && (
                    <div className="mt-5 grid gap-4 border-t border-white/10 pt-5 sm:grid-cols-2 lg:grid-cols-3">
                      <Detail label="Application ID">{app.ID}</Detail>
                      <Detail label="Email">
                        <a href={`mailto:${app.Email}`} className="text-signal">
                          {app.Email}
                        </a>
                      </Detail>
                      <Detail label="Phone">{app.Phone}</Detail>
                      <Detail label="Degree">{app.Degree}</Detail>
                      <Detail label="Branch">{app.Branch}</Detail>
                      <Detail label="Graduation Year">
                        {app.GraduationYear}
                      </Detail>
                      <Detail label="Portfolio / Resume">
                        {/^https?:\/\//i.test(app.PortfolioLink) ? (
                          <a
                            href={app.PortfolioLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-signal"
                          >
                            {app.PortfolioLink}
                          </a>
                        ) : (
                          app.PortfolioLink
                        )}
                      </Detail>
                      <div className="sm:col-span-2 lg:col-span-3">
                        <Detail label="Note / Availability">{app.Note}</Detail>
                      </div>
                      {app.Status !== "Pending" && (
                        <button
                          onClick={() => handleStatus(app, "Pending")}
                          disabled={busy}
                          className="w-fit rounded border border-white/20 px-3 py-2 text-sm text-muted disabled:opacity-40"
                        >
                          Reset to Pending
                        </button>
                      )}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default InternshipManagement;
