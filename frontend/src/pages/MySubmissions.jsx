import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMySubmissions } from "../services/researchPaperService";
import PageHeader from "../components/ui/PageHeader";
import { publicPage } from "../components/ui/pageStyles";

function MySubmissions() {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const data = await getMySubmissions();
        setPapers(data);
      } catch (err) {
        setError(
          err.response?.data?.detail || "Unable to load your submissions.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  const statusStyle = {
    pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
    approved: "bg-green-500/10 text-green-400 border-green-500/30",
    rejected: "bg-red-500/10 text-red-400 border-red-500/30",
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-space-950 flex items-center justify-center text-signal">
        Loading your submissions...
      </div>
    );
  }

  return (
    <section className={publicPage}>
      <div className="mx-auto max-w-5xl">
        <Link
          to="/published-papers"
          className="text-sm text-signal hover:underline"
        >
          ← Back to Publications
        </Link>

        <PageHeader
          className="mt-8"
          eyebrow="Research Publications"
          title="My Submissions"
          description="Track the review status of your submitted research papers."
        />

        {error && (
          <p className="mb-6 rounded-lg bg-red-500/10 p-4 text-red-400">
            {error}
          </p>
        )}

        {!error && papers.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-space-800 p-10 text-center">
            <h2 className="text-xl font-semibold">No submissions yet</h2>
            <p className="mt-3 text-muted">
              You haven't submitted any research papers.
            </p>

            <Link
              to="/submit-research-paper"
              className="mt-6 inline-block rounded-lg bg-signal px-6 py-3 font-semibold text-space-950"
            >
              Submit Your Paper
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {papers.map((paper) => (
              <div
                key={paper.id}
                className="rounded-2xl border border-white/10 bg-space-800 p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <h2 className="text-xl font-semibold">{paper.title}</h2>

                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-semibold capitalize ${
                      statusStyle[paper.status] ||
                      "border-gray-500/30 text-muted"
                    }`}
                  >
                    {paper.status}
                  </span>
                </div>

                <p className="mt-3 text-sm text-muted">
                  Authors: {paper.authors}
                </p>

                <p className="mt-4 leading-7 text-muted">{paper.abstract}</p>

                {paper.status === "rejected" && paper.rejection_reason && (
                  <div className="mt-5 rounded-lg bg-red-500/10 p-4">
                    <p className="text-sm font-semibold text-red-400">
                      Rejection Reason
                    </p>
                    <p className="mt-2 text-sm text-muted">
                      {paper.rejection_reason}
                    </p>
                  </div>
                )}

                <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                  <p className="text-xs text-muted">
                    Submitted: {new Date(paper.created_at).toLocaleDateString()}
                  </p>

                  <a
                    href={paper.pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-signal hover:underline"
                  >
                    View Submitted PDF →
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default MySubmissions;
