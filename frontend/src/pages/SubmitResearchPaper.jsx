import { useState } from "react";
import {
  uploadResearchPaperPdf,
  submitResearchPaper,
} from "../services/researchPaperService";

function SubmitResearchPaper() {
  const [formData, setFormData] = useState({
    title: "",
    abstract: "",
    authors: "",
    affiliation: "",
    keywords: "",
  });

  const [pdfFile, setPdfFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!pdfFile) {
      setError("Please select a PDF file.");
      return;
    }

    if (pdfFile.type !== "application/pdf") {
      setError("Only PDF files are allowed.");
      return;
    }

    if (pdfFile.size > 20 * 1024 * 1024) {
      setError("PDF size must be less than 20 MB.");
      return;
    }

    try {
      setLoading(true);

      const uploadResponse = await uploadResearchPaperPdf(pdfFile);

      await submitResearchPaper({
        ...formData,
        pdf_url: uploadResponse.pdf_url,
        cloudinary_public_id: uploadResponse.public_id,
      });
      setSuccess(
        "Research paper submitted successfully! It is now awaiting admin approval.",
      );

      setFormData({
        title: "",
        abstract: "",
        authors: "",
        affiliation: "",
        keywords: "",
      });

      setPdfFile(null);
      e.target.reset();
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Unable to submit research paper. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-[#060A13] px-6 py-16 text-[#E9EEF6]">
      <div className="mx-auto max-w-3xl">
        <p className="mb-3 text-sm uppercase tracking-[0.3em] text-[#3EE0FF]">
          Research Publications
        </p>

        <h1 className="mb-3 text-3xl font-bold">Submit Your Research Paper</h1>

        <p className="mb-10 text-gray-400">
          Share your research with the Mani Aerospace community. Your submission
          will be reviewed by the admin before publication.
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl border border-[#1D2940] bg-[#0C1322] p-8"
        >
          {[
            { name: "title", label: "Paper Title", required: true },
            { name: "authors", label: "Authors", required: true },
            { name: "affiliation", label: "Affiliation" },
            { name: "keywords", label: "Keywords" },
          ].map((field) => (
            <div key={field.name}>
              <label className="mb-2 block text-sm font-medium">
                {field.label}
              </label>

              <input
                type="text"
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                required={field.required}
                className="w-full rounded-lg border border-[#1D2940] bg-[#060A13] px-4 py-3 text-white outline-none focus:border-[#3EE0FF]"
              />
            </div>
          ))}

          <div>
            <label className="mb-2 block text-sm font-medium">Abstract</label>

            <textarea
              name="abstract"
              value={formData.abstract}
              onChange={handleChange}
              required
              minLength={50}
              rows={6}
              className="w-full rounded-lg border border-[#1D2940] bg-[#060A13] px-4 py-3 text-white outline-none focus:border-[#3EE0FF]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Research Paper PDF
            </label>

            <input
              type="file"
              accept=".pdf,application/pdf"
              required
              onChange={(e) => setPdfFile(e.target.files[0] || null)}
              className="w-full rounded-lg border border-[#1D2940] bg-[#060A13] p-3 text-gray-300 file:mr-4 file:rounded-md file:border-0 file:bg-[#3EE0FF] file:px-4 file:py-2 file:font-semibold file:text-[#060A13]"
            />

            <p className="mt-2 text-xs text-gray-500">
              PDF only. Maximum file size: 20 MB.
            </p>
          </div>

          {error && (
            <p className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
              {error}
            </p>
          )}

          {success && (
            <p className="rounded-lg bg-green-500/10 p-3 text-sm text-green-400">
              {success}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !pdfFile}
            className="w-full rounded-lg bg-[#3EE0FF] py-3 font-bold text-[#060A13] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Uploading and Submitting..." : "Submit Research Paper"}
          </button>
        </form>
      </div>
    </section>
  );
}

export default SubmitResearchPaper;
