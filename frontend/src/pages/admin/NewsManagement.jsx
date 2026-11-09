import { useEffect, useState } from "react";
import newsService from "../../services/newsService";

const emptyForm = {
  title: "",
  category: "",
  author: "MANI Aerospace",
  summary: "",
  content: "",
  image_url: "",
  published: false,
};

function NewsManagement() {
  const [news, setNews] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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

  useEffect(() => {
    return () => {
      if (preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      setError("Only JPG, PNG and WEBP images are allowed.");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5 MB.");
      e.target.value = "";
      return;
    }

    setError("");
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setImageFile(null);
    setPreview("");
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      let imageUrl = form.image_url;

      if (imageFile) {
        const response = await newsService.uploadImage(imageFile);
        imageUrl = response.data.image_url;
      }

      const payload = {
        ...form,
        image_url: imageUrl.trim() || null,
      };

      if (editingId) {
        await newsService.updateNews(editingId, payload);
      } else {
        await newsService.createNews(payload);
      }

      resetForm();
      await loadNews();
    } catch {
      setError("Unable to save news or upload image. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setImageFile(null);

    setForm({
      title: item.title,
      category: item.category,
      author: item.author,
      summary: item.summary,
      content: item.content,
      image_url: item.image_url || "",
      published: item.published,
    });

    setPreview(item.image_url || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
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

          <label className="grid gap-2">
            Upload News Image
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
              className="rounded-md border border-white/10 bg-[#060A13] p-3"
            />
            <span className="text-sm text-slate-400">
              JPG, PNG or WEBP · Maximum 5 MB
            </span>
          </label>

          {preview && (
            <div className="grid gap-2">
              <p className="text-sm text-slate-400">Image Preview</p>
              <img
                src={preview}
                alt="News preview"
                className="h-56 w-full rounded-lg border border-white/10 object-cover"
              />
            </div>
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
            <button
              type="submit"
              disabled={saving}
              className="rounded-md bg-cyan-400 px-6 py-3 font-semibold text-black disabled:opacity-50"
            >
              {saving ? "Saving..." : editingId ? "Update News" : "Create News"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
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
                <div className="flex items-center gap-4">
                  {item.image_url && (
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="h-20 w-28 rounded-md object-cover"
                    />
                  )}

                  <div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="mt-1 text-sm text-slate-400">
                      {item.category} · {item.published ? "Published" : "Draft"}
                    </p>
                  </div>
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
