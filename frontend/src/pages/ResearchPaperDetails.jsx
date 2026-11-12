import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  getPublishedPaper,
  getPaperComments,
  addPaperComment,
} from "../services/researchPaperService";
import { useAuth } from "../context/AuthContext";

function ResearchPaperDetails() {
  const { paperId } = useParams();
  const { user, loading: authLoading } = useAuth();

  const [paper, setPaper] = useState(null);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchPaperDetails = async () => {
    try {
      setLoading(true);
      setError("");

      const [paperData, commentsData] = await Promise.all([
        getPublishedPaper(paperId),
        getPaperComments(paperId),
      ]);

      setPaper(paperData);
      setComments(commentsData);
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to load research paper.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      fetchPaperDetails();
    }
  }, [paperId, authLoading]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (!comment.trim()) return;

    try {
      setSubmitting(true);

      const newComment = await addPaperComment(paperId, comment.trim());

      setComments((prev) => [...prev, newComment]);
      setComment("");

      setPaper((prev) => ({
        ...prev,
        comments_count: prev.comments_count + 1,
      }));
    } catch (err) {
      alert(err.response?.data?.detail || "Unable to add comment.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-space-950 flex items-center justify-center text-signal">
        Loading research paper...
      </div>
    );
  }

  if (error || !paper) {
    return (
      <div className="min-h-screen bg-space-950 text-white flex flex-col items-center justify-center px-6">
        <p className="text-red-400 mb-5">
          {error || "Research paper not found."}
        </p>
        <Link to="/published-papers" className="text-signal hover:underline">
          Back to Publications
        </Link>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-space-950 px-6 py-16 text-ink">
      <div className="mx-auto max-w-5xl">
        <Link
          to="/published-papers"
          className="text-sm text-signal hover:underline"
        >
          ← Back to Publications
        </Link>

        <div className="mt-8 rounded-2xl border border-white/10 bg-space-800 p-8">
          <p className="mb-4 text-sm uppercase tracking-widest text-signal">
            Research Publication
          </p>

          <h1 className="text-3xl font-bold leading-tight md:text-4xl">
            {paper.title}
          </h1>

          <div className="mt-6 space-y-2 text-sm text-muted">
            <p>
              <span className="text-white">Authors:</span> {paper.authors}
            </p>

            {paper.affiliation && (
              <p>
                <span className="text-white">Affiliation:</span>{" "}
                {paper.affiliation}
              </p>
            )}

            {paper.keywords && (
              <p>
                <span className="text-white">Keywords:</span> {paper.keywords}
              </p>
            )}

            <p>
              <span className="text-white">Published:</span>{" "}
              {new Date(paper.created_at).toLocaleDateString()}
            </p>
          </div>

          <div className="my-8 border-t border-white/10" />

          <h2 className="mb-4 text-xl font-semibold">Abstract</h2>

          <p className="whitespace-pre-line leading-8 text-muted">
            {paper.abstract}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-5">
            <span className="text-sm text-muted">
              ♥ {paper.likes_count} Likes
            </span>

            <span className="text-sm text-muted">
              {paper.comments_count} Comments
            </span>

            <a
              href={paper.pdf_url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-signal px-5 py-2.5 font-semibold text-space-950 transition hover:bg-white"
            >
              View / Download PDF
            </a>
          </div>
        </div>

        <div className="mt-10 rounded-2xl border border-white/10 bg-space-800 p-8">
          <h2 className="mb-6 text-2xl font-semibold">
            Discussion ({comments.length})
          </h2>

          {comments.length === 0 ? (
            <p className="text-muted">
              No comments yet. Start the discussion!
            </p>
          ) : (
            <div className="space-y-5">
              {comments.map((item) => (
                <div
                  key={item.id}
                  className="border-b border-white/10 pb-5 last:border-0"
                >
                  <p className="mb-2 text-xs text-signal">
                    {item.user_name ||
                      (item.admin_username
                        ? `Admin: ${item.admin_username}`
                        : "Unknown User")}
                  </p>

                  <p className="leading-7 text-muted">{item.comment}</p>

                  <p className="mt-2 text-xs text-muted">
                    {new Date(item.created_at).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}

          {user ? (
            <form onSubmit={handleCommentSubmit} className="mt-8 space-y-4">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write your comment..."
                rows={4}
                maxLength={3000}
                className="w-full rounded-lg border border-white/10 bg-space-950 p-4 text-white outline-none focus:border-signal"
              />

              <button
                type="submit"
                disabled={submitting || !comment.trim()}
                className="rounded-lg bg-signal px-6 py-3 font-semibold text-space-950 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? "Posting..." : "Post Comment"}
              </button>
            </form>
          ) : (
            <p className="mt-8 text-sm text-muted">
              Sign in with Google to join the discussion.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

export default ResearchPaperDetails;
