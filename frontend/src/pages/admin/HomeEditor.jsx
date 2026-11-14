import { useEffect, useState } from "react";
import contentService from "../../services/contentService";
import { adminPage, adminTitle } from "../../components/ui/pageStyles";

function HomeEditor() {
  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    description: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    contentService
      .getHomeContent()
      .then((response) => setForm(response.data))
      .catch(() => setMessage("No existing content found. Enter new content."))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      await contentService.updateHomeContent(form);
      setMessage("Homepage content updated successfully.");
    } catch {
      setMessage("Failed to update homepage content.");
    }
  };

  if (loading) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-space-950 text-signal">
        Loading content...
      </section>
    );
  }

  return (
    <section className={adminPage}>
      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-3xl space-y-6 rounded-xl bg-space-800 p-8"
      >
        <h1 className={adminTitle}>Edit Homepage</h1>

        {["title", "subtitle", "description"].map((field) => (
          <label key={field} className="block capitalize">
            {field}
            {field === "description" ? (
              <textarea
                name={field}
                value={form[field]}
                onChange={handleChange}
                rows={5}
                required
                className="mt-2 w-full rounded-md bg-space-950 p-3"
              />
            ) : (
              <input
                name={field}
                value={form[field]}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-md bg-space-950 p-3"
              />
            )}
          </label>
        ))}

        <button className="rounded-md bg-signal px-6 py-3 font-semibold text-black">
          Save Changes
        </button>

        {message && <p className="text-signal">{message}</p>}
      </form>
    </section>
  );
}

export default HomeEditor;
