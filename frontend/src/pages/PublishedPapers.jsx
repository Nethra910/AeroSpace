import { useEffect, useState } from "react";
import {
  getPublishedPapers,
  likePaper,
  unlikePaper,
} from "../services/researchPaperService";

import { useAuth } from "../context/AuthContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import OrganisationIdentity from "../components/brand/OrganisationIdentity";
import PageHeader from "../components/ui/PageHeader";
import { publicPage } from "../components/ui/pageStyles";

function PublishedPapers() {
  const [papers, setPapers] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [likingId, setLikingId] = useState(null);
  const location = useLocation();

  const { user, loading: authLoading } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();

  const fetchPapers = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getPublishedPapers({
        search,
        page,
        limit: 6,
      });

      setPapers(data.items);
      setTotalPages(data.total_pages);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to load research papers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      fetchPapers();
    }
  }, [search, page, authLoading]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  };

  const handleLike = async (paper) => {
    if (authLoading) return;

    if (!user) {
      setShowLoginModal(true);
      return;
    }

    try {
      setLikingId(paper.id);
      setError("");

      if (paper.is_liked) {
        await unlikePaper(paper.id);
      } else {
        await likePaper(paper.id);
      }

      setPapers((current) =>
        current.map((item) =>
          item.id === paper.id
            ? {
                ...item,
                is_liked: !item.is_liked,
                likes_count: item.likes_count + (item.is_liked ? -1 : 1),
              }
            : item,
        ),
      );
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to update like.");
    } finally {
      setLikingId(null);
    }
  };
  return (
    <section className={publicPage}>
      <div className="mx-auto max-w-7xl">
        <OrganisationIdentity className="mb-14" />

        <PageHeader
          eyebrow="Research & Knowledge"
          title="Published Papers"
          description="Explore research papers, technical publications, and engineering contributions published through the MANI Research Organisation."
        />

        <form
          onSubmit={handleSearch}
          className="mb-10 flex flex-col gap-3 sm:flex-row"
        >
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by title, author, abstract or keyword..."
            className="w-full rounded-lg border border-white/10 bg-space-800 px-5 py-3 text-white outline-none focus:border-signal"
          />

          <button
            type="submit"
            className="rounded-lg bg-signal px-8 py-3 font-semibold text-space-950 transition hover:bg-white"
          >
            Search
          </button>
        </form>

        {error && (
          <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-300">
            {error}
          </div>
        )}

        {loading ? (
          <p className="py-20 text-center text-muted">
            Loading research papers...
          </p>
        ) : papers.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-space-800 p-12 text-center">
            <h2 className="mb-3 text-2xl font-semibold text-signal">
              No Papers Found
            </h2>
            <p className="text-muted">
              No published research papers match your search.
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
              {papers.map((paper) => (
                <article
                  key={paper.id}
                  className="flex flex-col rounded-xl border border-white/10 bg-space-800 p-7 transition hover:border-signal/60"
                >
                  <div className="mb-5 flex items-center justify-between">
                    <span className="rounded-full bg-signal/10 px-3 py-1 text-xs font-semibold text-signal">
                      Published
                    </span>

                    <span className="text-sm text-muted">#{paper.id}</span>
                  </div>

                  <h2 className="mb-4 text-xl font-semibold leading-7">
                    {paper.title}
                  </h2>

                  <p className="mb-4 text-sm text-muted">By {paper.authors}</p>

                  <p className="mb-6 line-clamp-6 flex-1 leading-7 text-muted">
                    {paper.abstract}
                  </p>

                  {paper.keywords && (
                    <p className="mb-5 text-sm text-signal">{paper.keywords}</p>
                  )}

                  <div className="mb-6 flex items-center gap-5 text-sm text-muted">
                    <span>{paper.likes_count} Likes</span>
                    <button
                      onClick={() => {
                        if (authLoading) return;

                        if (!user) {
                          setShowLoginModal(true);
                        } else {
                          navigate(`/published-papers/${paper.id}`);
                        }
                      }}
                      className="transition hover:text-signal"
                    >
                      {paper.comments_count} Comments
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => handleLike(paper)}
                      disabled={likingId === paper.id}
                      className={`rounded-lg px-4 py-2 text-sm font-semibold transition disabled:opacity-50 ${
                        paper.is_liked
                          ? "bg-signal text-space-950"
                          : "border border-signal text-signal hover:bg-signal hover:text-space-950"
                      }`}
                    >
                      {likingId === paper.id
                        ? "Updating..."
                        : paper.is_liked
                          ? "Unlike"
                          : "Like"}
                    </button>

                    <Link
                      to={`/published-papers/${paper.id}`}
                      className="rounded-lg border border-signal px-4 py-2 text-sm font-semibold text-signal transition hover:bg-signal hover:text-space-950"
                    >
                      View Details
                    </Link>

                    <a
                      href={paper.pdf_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
                    >
                      View PDF
                    </a>
                  </div>
                </article>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-5">
                <button
                  onClick={() => setPage((current) => current - 1)}
                  disabled={page === 1}
                  className="rounded-lg border border-white/10 px-5 py-2 disabled:opacity-30"
                >
                  Previous
                </button>

                <span className="text-sm text-muted">
                  Page {page} of {totalPages}
                </span>

                <button
                  onClick={() => setPage((current) => current + 1)}
                  disabled={page === totalPages}
                  className="rounded-lg border border-white/10 px-5 py-2 disabled:opacity-30"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-space-800 p-8 text-center shadow-2xl">
            <h2 className="mb-3 text-2xl font-bold text-white">
              Login Required
            </h2>

            <p className="mb-7 text-muted">
              Please login to like and comment on research papers.
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowLoginModal(false)}
                className="rounded-lg border border-white/10 px-6 py-3 text-white transition hover:bg-white/10"
              >
                Cancel
              </button>

              <Link
                to="/login"
                state={{ from: location }}
                className="rounded-lg bg-signal px-6 py-3 font-semibold text-space-950"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default PublishedPapers;
