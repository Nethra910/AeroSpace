import { useEffect, useState } from "react";
import contentService from "../../services/contentService";

function MissionEditor() {
  const [form, setForm] = useState({
    title: "",
    description: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    contentService
      .getMissionContent()
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
      await contentService.updateMissionContent(form);
      setMessage("Mission content updated successfully.");
    } catch {
      setMessage("Failed to update mission content.");
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
    <section className="min-h-screen bg-space-950 px-6 py-16 text-white">
      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-3xl space-y-6 rounded-xl bg-space-800 p-8"
      >
        <h1 className="text-3xl font-bold">Edit Mission</h1>

        <label className="block">
          Title
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="mt-2 w-full rounded-md bg-space-950 p-3"
          />
        </label>

        <label className="block">
          Description
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={8}
            required
            className="mt-2 w-full rounded-md bg-space-950 p-3"
          />
        </label>

        <button className="rounded-md bg-signal px-6 py-3 font-semibold text-black">
          Save Changes
        </button>

        {message && <p className="text-signal">{message}</p>}
      </form>
    </section>
  );
}

export default MissionEditor;
