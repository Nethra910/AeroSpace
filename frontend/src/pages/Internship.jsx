// src/pages/Internship.jsx
// Public internship application form for MANI Aerospace.
// Submits straight to the Google Apps Script web app (see services/internshipApi.js).
import { useState } from "react";
import PageHeader from "../components/ui/PageHeader";
import { publicPage } from "../components/ui/pageStyles";
import { submitApplication, TRACKS } from "../services/internshipApi";
import InternshipStatusCheck from "../components/internship/InternshipStatusCheck";

const DEGREES = [
  "B.E / B.Tech",
  "M.E / M.Tech",
  "B.Sc",
  "M.Sc",
  "Diploma",
  "Other",
];
const THIS_YEAR = new Date().getFullYear();
const GRAD_YEARS = Array.from({ length: 7 }, (_, i) => String(THIS_YEAR + i));

const EMPTY = {
  fullName: "",
  email: "",
  phone: "",
  college: "",
  degree: "",
  branch: "",
  graduationYear: "",
  track: "",
  portfolioLink: "",
  note: "",
  hpField: "", // honeypot: hidden from humans, bots fill it in
};

// Client-side validation (the Apps Script re-checks everything on the server).
function validate(v) {
  const e = {};
  if (v.fullName.trim().length < 2) e.fullName = "Enter your full name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim()))
    e.email = "Enter a valid email address.";
  if (!/^[+\d][\d\s-]{7,15}$/.test(v.phone.trim()))
    e.phone = "Enter a valid phone number.";
  if (!v.college.trim()) e.college = "Enter your college or university.";
  if (!v.degree) e.degree = "Select your degree.";
  if (!v.branch.trim()) e.branch = "Enter your branch or specialisation.";
  if (!v.graduationYear) e.graduationYear = "Select your graduation year.";
  if (!v.track) e.track = "Choose a preferred track.";
  if (!/^https?:\/\/\S+$/i.test(v.portfolioLink.trim()))
    e.portfolioLink = "Enter a full link starting with https://";
  if (v.note.length > 1000) e.note = "Keep this under 1000 characters.";
  return e;
}

// Label + input + inline error, so every field looks and behaves the same.
function Field({ label, error, hint, children }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium">{label}</label>
      {children}
      {hint && !error && <p className="mt-2 text-xs text-muted">{hint}</p>}
      {error && <p className="mt-2 text-xs text-danger">{error}</p>}
    </div>
  );
}

const inputClass =
  "w-full rounded-lg border border-white/10 bg-space-950 px-4 py-3 text-white outline-none focus:border-signal";

function Internship() {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [applicationId, setApplicationId] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined })); // clear as user fixes it
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length) return;

    try {
      setLoading(true);
      const res = await submitApplication(values);
      setApplicationId(res.id);
      setValues(EMPTY);
    } catch (err) {
      setSubmitError(
        err.message || "Unable to submit your application. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  // ---- Success confirmation ----
  if (applicationId) {
    return (
      <section className={publicPage}>
        <div className="mx-auto max-w-3xl">
          <PageHeader
            eyebrow="Internships"
            title="Application Received"
            description="Thank you for applying to MANI Aerospace. Our team will review your application and contact you by email."
          />
          <div className="rounded-2xl border border-white/10 bg-space-800 p-8">
            <p className="text-sm text-muted">Your application ID</p>
            <p className="mt-2 font-mono text-2xl text-signal">
              {applicationId}
            </p>
            <p className="mt-4 text-sm text-muted">
              Keep this ID for any follow-up queries.
            </p>
            <button
              type="button"
              onClick={() => setApplicationId("")}
              className="mt-8 rounded-lg border border-white/20 px-6 py-3"
            >
              Submit another application
            </button>
          </div>
          <InternshipStatusCheck />
        </div>
      </section>
    );
  }

  // ---- Form ----
  return (
    <section className={publicPage}>
      <div className="mx-auto max-w-3xl">
        <PageHeader
          eyebrow="Internships"
          title="Intern With MANI Aerospace"
          description="Work alongside our researchers and engineers on real aerospace problems. Tell us about yourself and the track you'd like to join."
        />

        <form
          onSubmit={handleSubmit}
          noValidate
          className="space-y-6 rounded-2xl border border-white/10 bg-space-800 p-8"
        >
          <div className="grid gap-6 md:grid-cols-2">
            <Field label="Full Name" error={errors.fullName}>
              <input
                name="fullName"
                value={values.fullName}
                onChange={handleChange}
                maxLength={120}
                className={inputClass}
              />
            </Field>
            <Field label="Email" error={errors.email}>
              <input
                type="email"
                name="email"
                value={values.email}
                onChange={handleChange}
                maxLength={160}
                className={inputClass}
              />
            </Field>
            <Field
              label="Phone"
              error={errors.phone}
              hint="Include country code if outside India."
            >
              <input
                type="tel"
                name="phone"
                value={values.phone}
                onChange={handleChange}
                maxLength={20}
                className={inputClass}
              />
            </Field>
            <Field label="College / University" error={errors.college}>
              <input
                name="college"
                value={values.college}
                onChange={handleChange}
                maxLength={160}
                className={inputClass}
              />
            </Field>
            <Field label="Degree" error={errors.degree}>
              <select
                name="degree"
                value={values.degree}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">Select degree</option>
                {DEGREES.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Branch / Specialisation" error={errors.branch}>
              <input
                name="branch"
                value={values.branch}
                onChange={handleChange}
                maxLength={120}
                className={inputClass}
              />
            </Field>
            <Field label="Graduation Year" error={errors.graduationYear}>
              <select
                name="graduationYear"
                value={values.graduationYear}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">Select year</option>
                {GRAD_YEARS.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Preferred Track" error={errors.track}>
              <select
                name="track"
                value={values.track}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">Select track</option>
                {TRACKS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Field
            label="Portfolio / GitHub / Resume Link"
            error={errors.portfolioLink}
            hint="A public link (GitHub, LinkedIn, or a shared Drive resume)."
          >
            <input
              type="url"
              name="portfolioLink"
              value={values.portfolioLink}
              onChange={handleChange}
              placeholder="https://"
              className={inputClass}
            />
          </Field>

          <Field
            label="Note / Availability"
            error={errors.note}
            hint={`${values.note.length}/1000 · Tell us why you're interested and when you're available.`}
          >
            <textarea
              name="note"
              value={values.note}
              onChange={handleChange}
              rows={5}
              maxLength={1000}
              className={inputClass}
            />
          </Field>

          {/* Honeypot – invisible to people, tempting to bots */}
          <div
            aria-hidden="true"
            className="absolute -left-[9999px] h-0 w-0 overflow-hidden"
          >
            <input
              name="hpField"
              value={values.hpField}
              onChange={handleChange}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />
          </div>

          {submitError && (
            <p
              role="alert"
              className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400"
            >
              {submitError}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-signal py-3 font-bold text-space-950 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit Application"}
          </button>
        </form>

        <InternshipStatusCheck />
      </div>
    </section>
  );
}

export default Internship;
