import { useEffect, useState } from "react";
import {
  getAllResearchPapers,
  reviewResearchPaper,
  deleteResearchPaper,
} from "../../services/researchPaperService";
import { useNavigate } from "react-router-dom";
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
      <div className="flex min-h-screen items-center justify-center bg-[#060A13]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#1D2940] border-t-[#3EE0FF]" />
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
    <div className="min-h-screen bg-[#060A13] px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        {/* <h1 className="mb-8 text-3xl font-bold">Research Paper Management</h1> */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-3xl font-bold">Research Paper Management</h1>

          <button
            onClick={() => navigate("/admin/research-papers/publish")}
            className="rounded-lg bg-[#3EE0FF] px-5 py-3 font-semibold text-[#060A13] hover:bg-cyan-300"
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
                  ? "bg-[#3EE0FF] text-[#060A13]"
                  : "border border-[#1D2940] bg-[#0C1322] text-gray-300 hover:border-[#3EE0FF]"
              }`}
            >
              {status === "all" ? "All Papers" : status}
            </button>
          ))}
        </div>

        {filteredPapers.length === 0 ? (
          <p className="text-gray-400">
            No {activeStatus === "all" ? "" : activeStatus} papers found.
          </p>
        ) : (
          <div className="space-y-5">
            {filteredPapers.map((paper) => (
              <div
                key={paper.id}
                className="rounded-xl border border-[#1D2940] bg-[#0C1322] p-6"
              >
                <h2 className="text-xl font-semibold">{paper.title}</h2>
                <p className="mt-2 text-gray-400">{paper.authors}</p>
                <p className="mt-4 text-gray-300">{paper.abstract}</p>

                <a
                  href={paper.pdf_url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-block text-[#3EE0FF]"
                >
                  View PDF
                </a>
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
                      className="mt-4 w-full rounded-lg border border-[#1D2940] bg-[#060A13] p-3 text-white"
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
                  <button
                    onClick={() => handleDelete(paper.id)}
                    disabled={processingId === paper.id}
                    className="mt-4 rounded-lg bg-red-600 px-5 py-2 font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
                  >
                    {processingId === paper.id ? "Deleting..." : "Delete Paper"}
                  </button>
                )}
                {/* <textarea
                  value={rejectionReason[paper.id] || ""}
                  onChange={(e) =>
                    setRejectionReason((previous) => ({
                      ...previous,
                      [paper.id]: e.target.value,
                    }))
                  }
                  placeholder="Enter rejection reason"
                  className="mt-4 w-full rounded-lg border border-[#1D2940] bg-[#060A13] p-3 text-white"
                /> */}

                {/* <div className="mt-4 flex gap-3">
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
                </div> */}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ResearchPaperManagement;
