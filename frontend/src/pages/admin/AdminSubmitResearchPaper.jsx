import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  uploadAdminResearchPaperPdf,
  submitAdminResearchPaper,
} from "../../services/researchPaperService";

function AdminSubmitResearchPaper() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    abstract: "",
    authors: "",
    affiliation: "",
    keywords: "",
  });

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError("Please select a PDF file.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const uploadResponse = await uploadAdminResearchPaperPdf(file);

      await submitAdminResearchPaper({
        ...formData,
        pdf_url: uploadResponse.pdf_url,
        cloudinary_public_id: uploadResponse.public_id,
      });

      alert("Research paper published successfully!");
      navigate("/admin/research-papers");
    } catch (err) {
      setError(
        err.response?.data?.detail || "Failed to publish research paper.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-space-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-3xl">
        <button
          onClick={() => navigate("/admin/dashboard")}
          className="mb-8 text-signal"
        >
          ← Back to Dashboard
        </button>

        <h1 className="mb-3 text-3xl font-bold">Publish Research Paper</h1>

        <p className="mb-8 text-muted">
          Admin submissions are published immediately without approval.
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-xl border border-white/10 bg-space-800 p-8"
        >
          {[
            ["title", "Paper Title"],
            ["authors", "Authors"],
            ["affiliation", "Affiliation"],
            ["keywords", "Keywords"],
          ].map(([name, label]) => (
            <div key={name}>
              <label className="mb-2 block">{label}</label>
              <input
                name={name}
                value={formData[name]}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-white/10 bg-space-950 p-3 outline-none focus:border-signal"
              />
            </div>
          ))}

          <div>
            <label className="mb-2 block">Abstract</label>
            <textarea
              name="abstract"
              value={formData.abstract}
              onChange={handleChange}
              required
              rows={6}
              className="w-full rounded-lg border border-white/10 bg-space-950 p-3 outline-none focus:border-signal"
            />
          </div>

          <div>
            <label className="mb-2 block">Research Paper PDF</label>
            <input
              type="file"
              accept=".pdf,application/pdf"
              onChange={(e) => setFile(e.target.files[0] || null)}
              required
              className="w-full rounded-lg border border-white/10 bg-space-950 p-3"
            />
            <p className="mt-2 text-sm text-muted">
              Maximum file size: 20 MB.
            </p>
          </div>

          {error && <p className="text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-signal p-3 font-semibold text-space-950 disabled:opacity-50"
          >
            {loading ? "Publishing..." : "Publish Research Paper"}
          </button>
        </form>
      </div>
    </section>
  );
}

export default AdminSubmitResearchPaper;
