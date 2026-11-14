import { useEffect, useState } from "react";
import {
  getAllResearchPapers,
  reviewResearchPaper,
  deleteResearchPaper,
} from "../../services/researchPaperService";
import { useNavigate } from "react-router-dom";
import { adminPage, adminTitle } from "../../components/ui/pageStyles";
function ResearchPaperManagement() {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingId, setProcessingId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState({});
  const navigate = useNavigate();

  const [activeStatus, setActiveStatus] = useState("all");

  const filteredPapers =
    activeStatus === "all"
      ? papers
      : papers.filter((paper) => paper.status === activeStatus);

  const handleDelete = async (paperId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this research paper?",
    );

    if (!confirmed) return;

    try {
      setProcessingId(paperId);

      await deleteResearchPaper(paperId);

      setPapers((previous) => previous.filter((paper) => paper.id !== paperId));
    } catch (error) {
      alert(error.response?.data?.detail || "Failed to delete paper.");
    } finally {
      setProcessingId(null);
    }
  };

  useEffect(() => {
    const fetchPapers = async () => {
      try {
        const data = await getAllResearchPapers();
        setPapers(data);
      } catch (err) {
        setError("Failed to load pending research papers.");
      } finally {
        setLoading(false);
      }
    };

    fetchPapers();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-space-950">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/10 border-t-signal" />
      </div>
    );
  }

  if (error) {
    return <div className="p-8 text-red-400">{error}</div>;
  }
  const handleReview = async (paperId, status) => {
    const reason = rejectionReason[paperId]?.trim();

    if (status === "rejected" && !reason) {
      alert("Please provide a rejection reason.");
      return;
    }

    try {
      setProcessingId(paperId);

      await reviewResearchPaper(
        paperId,
        status,
        status === "rejected" ? reason : null,
      );

      setPapers((previous) => previous.filter((paper) => paper.id !== paperId));
    } catch (error) {
      alert(error.response?.data?.detail || "Review failed.");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className={adminPage}>
      <div className="mx-auto max-w-7xl">
        {/* <h1 className="mb-8 text-3xl font-bold">Research Paper Management</h1> */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <h1 className={adminTitle}>Research Paper Management</h1>

          <button
            onClick={() => navigate("/admin/research-papers/publish")}
            className="rounded-lg bg-signal px-5 py-3 font-semibold text-space-950 hover:bg-signal"
          >
            + Publish Research Paper
          </button>
        </div>
        <div className="mb-8 flex flex-wrap gap-3">
          {["all", "pending", "approved", "rejected"].map((status) => (
            <button
              key={status}
              onClick={() => setActiveStatus(status)}
              className={`rounded-lg px-5 py-2 capitalize transition ${
                activeStatus === status
                  ? "bg-signal text-space-950"
                  : "border border-white/10 bg-space-800 text-muted hover:border-signal"
              }`}
            >
              {status === "all" ? "All Papers" : status}
            </button>
          ))}
        </div>

        {filteredPapers.length === 0 ? (
          <p className="text-muted">
            No {activeStatus === "all" ? "" : activeStatus} papers found.
          </p>
        ) : (
          <div className="space-y-5">
            {filteredPapers.map((paper) => (
              <div
                key={paper.id}
                className="rounded-xl border border-white/10 bg-space-800 p-6"
              >
                <h2 className="text-xl font-semibold">{paper.title}</h2>
                <p className="mt-2 text-muted">{paper.authors}</p>
                <p className="mt-4 text-muted">{paper.abstract}</p>

                {paper.status === "pending" && (
                  <>
                    <textarea
                      value={rejectionReason[paper.id] || ""}
                      onChange={(e) =>
                        setRejectionReason((previous) => ({
                          ...previous,
                          [paper.id]: e.target.value,
                        }))
                      }
                      placeholder="Enter rejection reason"
                      className="mt-4 w-full rounded-lg border border-white/10 bg-space-950 p-3 text-white"
                    />

                    <div className="mt-4 flex gap-3">
                      <button
                        onClick={() => handleReview(paper.id, "approved")}
                        disabled={processingId === paper.id}
                        className="rounded-lg bg-green-600 px-5 py-2 font-medium disabled:opacity-50"
                      >
                        Approve
                      </button>

                      <button
                        onClick={() => handleReview(paper.id, "rejected")}
                        disabled={processingId === paper.id}
                        className="rounded-lg bg-red-600 px-5 py-2 font-medium disabled:opacity-50"
                      >
                        Reject
                      </button>
                    </div>
                  </>
                )}

                {paper.status !== "pending" && (
                  <div className="mt-4 flex items-center gap-6">
                    <a
                      href={paper.pdf_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-signal hover:underline"
                    >
                      View PDF
                    </a>
                    <button
                      onClick={() => handleDelete(paper.id)}
                      disabled={processingId === paper.id}
                      className="rounded-lg bg-red-600 px-5 py-2 font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
                    >
                      {processingId === paper.id
                        ? "Deleting..."
                        : "Delete Paper"}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ResearchPaperManagement;
