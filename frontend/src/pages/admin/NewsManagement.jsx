import { useEffect, useState } from "react";
import newsService from "../../services/newsService";

const emptyForm = {
  title: "",
  category: "",
  author: "MANI Aerospace",
  summary: "",
  content: "",
  published: false,
};

function NewsManagement() {
  const [news, setNews] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadNews = async () => {
    try {
      const response = await newsService.getAllNews();
      setNews(response.data);
    } catch {
      setError("Unable to load news.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNews();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (editingId) {
        await newsService.updateNews(editingId, form);
      } else {
        await newsService.createNews(form);
      }

      setForm(emptyForm);
      setEditingId(null);
      await loadNews();
    } catch {
      setError("Unable to save news. Please check your input.");
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setForm({
      title: item.title,
      category: item.category,
      author: item.author,
      summary: item.summary,
      content: item.content,
      published: item.published,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this news?")) return;

    try {
      await newsService.deleteNews(id);
      await loadNews();
    } catch {
      setError("Unable to delete news.");
    }
  };

  const handlePublish = async (id) => {
    try {
      await newsService.togglePublish(id);
      await loadNews();
    } catch {
      setError("Unable to change publish status.");
    }
  };

  return (
    <section className="min-h-screen bg-[#060A13] px-6 py-16 text-white">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-4xl font-bold">Manage News</h1>

        {error && <p className="mt-4 text-red-400">{error}</p>}

        <form
          onSubmit={handleSubmit}
          className="mt-10 grid gap-4 rounded-xl border border-white/10 bg-slate-900 p-6"
        >
          <h2 className="text-2xl font-semibold">
            {editingId ? "Edit News" : "Create News"}
          </h2>

          {["title", "category", "author", "summary", "content"].map(
            (field) => (
              <label key={field} className="grid gap-2 capitalize">
                {field}
                {field === "content" || field === "summary" ? (
                  <textarea
                    name={field}
                    value={form[field]}
                    onChange={handleChange}
                    rows={field === "content" ? 6 : 3}
                    required
                    className="rounded-md border border-white/10 bg-[#060A13] p-3"
                  />
                ) : (
                  <input
                    name={field}
                    value={form[field]}
                    onChange={handleChange}
                    required
                    className="rounded-md border border-white/10 bg-[#060A13] p-3"
                  />
                )}
              </label>
            ),
          )}

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="published"
              checked={form.published}
              onChange={handleChange}
            />
            Publish immediately
          </label>

          <div className="flex gap-3">
            <button className="rounded-md bg-cyan-400 px-6 py-3 font-semibold text-black">
              {editingId ? "Update News" : "Create News"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setForm(emptyForm);
                }}
                className="rounded-md border border-white/20 px-6"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        <h2 className="mt-16 text-2xl font-semibold">Existing News</h2>

        {loading ? (
          <p className="mt-6 text-slate-400">Loading news...</p>
        ) : (
          <div className="mt-6 grid gap-4">
            {news.map((item) => (
              <article
                key={item.id}
                className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-white/10 bg-slate-900 p-5"
              >
                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="mt-1 text-sm text-slate-400">
                    {item.category} · {item.published ? "Published" : "Draft"}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="rounded border border-white/20 px-3 py-2"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handlePublish(item.id)}
                    className="rounded border border-cyan-400 px-3 py-2 text-cyan-400"
                  >
                    {item.published ? "Unpublish" : "Publish"}
                  </button>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="rounded border border-red-400 px-3 py-2 text-red-400"
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default NewsManagement;
