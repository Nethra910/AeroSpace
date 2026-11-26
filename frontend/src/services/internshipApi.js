/**
 * internshipApi.js – thin client for the Google Apps Script Web App.
 * Put this in e.g. src/services/internshipApi.js
 *
 * Env var (.env):
 *   Vite:  VITE_INTERNSHIP_API_URL=https://script.google.com/macros/s/XXXX/exec
 *   CRA:   REACT_APP_INTERNSHIP_API_URL=...   (swap the line below)
 */
const API_URL = import.meta.env.VITE_INTERNSHIP_API_URL;
// const API_URL = process.env.REACT_APP_INTERNSHIP_API_URL;

export const STATUSES = ["Pending", "Selected", "Rejected"];

export const TRACKS = [
  "Avionics & Embedded Systems",
  "Aerodynamics & CFD",
  "Structures & Design (CAD)",
  "Propulsion",
  "UAV / Drone Systems",
  "Software & Data",
  "Manufacturing & Quality",
  "Other",
];

/**
 * Apps Script web apps don't answer CORS preflight (OPTIONS) requests, so we POST
 * with Content-Type "text/plain" (a "simple request" – no preflight) and JSON-encode the body.
 */
async function request(url, options) {
  if (!API_URL) throw new Error("Internship API URL is not configured.");
  let res;
  try {
    res = await fetch(url, options);
  } catch {
    throw new Error(
      "Network error. Please check your connection and try again.",
    );
  }
  const json = await res.json().catch(() => null);
  if (!json) throw new Error("Unexpected server response.");
  if (!json.ok) throw new Error(json.error || "Request failed.");
  return json;
}

const post = (payload) =>
  request(API_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(payload),
  });

/** Public: submit an application. Resolves to { ok, id }. */
export const submitApplication = (data) => post({ action: "submit", data });

/** Admin: fetch all applications (newest first). */
export const fetchApplications = async (adminKey) => {
  const qs = new URLSearchParams({ action: "list", adminKey });
  const json = await request(`${API_URL}?${qs}`, { method: "GET" });
  return json.applications;
};

/** Admin: set status to "Selected" | "Rejected" | "Pending" for the row with this ID. */
export const updateApplicationStatus = (id, status, adminKey) =>
  post({ action: "updateStatus", id, status, adminKey });

/** Public: look up status by Application ID or email. Resolves to [{ id, track, status, submitted }]. */
export const checkStatus = async (query) => {
  const qs = new URLSearchParams({ action: "status", query });
  const json = await request(`${API_URL}?${qs}`, { method: "GET" });
  return json.results;
};

/** Admin: permanently delete the row with this ID. */
export const deleteApplication = (id, adminKey) =>
  post({ action: "delete", id, adminKey });
