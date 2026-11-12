import { useEffect, useState } from "react";
import boardMemberService from "../../services/boardMemberService";

const emptyForm = {
  name: "",
  role: "",
  photo_url: "",
  linkedin_url: "",
};

const roles = ["Founder", "Director", "CEO", "COO"];

function BoardMemberManagement() {
  const [members, setMembers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadMembers = async () => {
    try {
      const response = await boardMemberService.getAllMembers();
      setMembers(response.data);
    } catch {
      setError("Unable to load board members.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  useEffect(() => {
    return () => {
      if (preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
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
      let photoUrl = form.photo_url;

      if (imageFile) {
        const response = await boardMemberService.uploadImage(imageFile);
        photoUrl = response.data.image_url;
      }

      const payload = {
        name: form.name.trim(),
        role: form.role || null,
        photo_url: photoUrl.trim(),
        linkedin_url: form.linkedin_url.trim(),
      };

      if (editingId) {
        await boardMemberService.updateMember(editingId, payload);
      } else {
        await boardMemberService.createMember(payload);
      }

      resetForm();
      await loadMembers();
    } catch {
      setError("Unable to save board member or upload image.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (member) => {
    setEditingId(member.id);
    setImageFile(null);

    setForm({
      name: member.name || "",
      role: member.role || "",
      photo_url: member.photo_url || "",
      linkedin_url: member.linkedin_url || "",
    });

    setPreview(member.photo_url || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this board member?")) {
      return;
    }

    try {
      await boardMemberService.deleteMember(id);
      await loadMembers();
    } catch {
      setError("Unable to delete board member.");
    }
  };

  return (
    <section className="min-h-screen bg-space-950 px-6 py-16 text-white">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-4xl font-bold">Manage Board Members</h1>

        {error && <p className="mt-4 text-red-400">{error}</p>}

        <form
          onSubmit={handleSubmit}
          className="mt-10 grid gap-5 rounded-xl border border-white/10 bg-space-800 p-6"
        >
          <h2 className="text-2xl font-semibold">
            {editingId ? "Edit Board Member" : "Add Board Member"}
          </h2>

          <label className="grid gap-2">
            Name
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="rounded-md border border-white/10 bg-space-950 p-3"
            />
          </label>

          <label className="grid gap-2">
            Role (Optional)
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="rounded-md border border-white/10 bg-space-950 p-3"
            >
              <option value="">Select Role</option>
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2">
            LinkedIn Profile URL
            <input
              type="url"
              name="linkedin_url"
              value={form.linkedin_url}
              onChange={handleChange}
              required
              className="rounded-md border border-white/10 bg-space-950 p-3"
            />
          </label>

          <label className="grid gap-2">
            Upload Profile Photo
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
              className="rounded-md border border-white/10 bg-space-950 p-3"
            />
            <span className="text-sm text-muted">
              JPG, PNG or WEBP · Maximum 5 MB
            </span>
          </label>

          {preview && (
            <img
              src={preview}
              alt="Board member preview"
              className="h-56 w-56 rounded-lg border border-white/10 object-cover"
            />
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving || (!editingId && !imageFile)}
              className="rounded-md bg-signal px-6 py-3 font-semibold text-black disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : editingId
                  ? "Update Member"
                  : "Add Member"}
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

        <h2 className="mt-16 text-2xl font-semibold">Existing Board Members</h2>

        {loading ? (
          <p className="mt-6 text-muted">Loading board members...</p>
        ) : members.length === 0 ? (
          <p className="mt-6 text-muted">No board members added yet.</p>
        ) : (
          <div className="mt-6 grid gap-4">
            {members.map((member) => (
              <article
                key={member.id}
                className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-white/10 bg-space-800 p-5"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={member.photo_url}
                    alt={member.name}
                    className="h-20 w-20 rounded-md object-cover"
                  />

                  <div>
                    <h3 className="font-semibold">{member.name}</h3>
                    <p className="text-sm text-muted">
                      {member.role || "Role not specified"}
                    </p>
                    <a
                      href={member.linkedin_url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 inline-block text-sm text-signal"
                    >
                      LinkedIn Profile
                    </a>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(member)}
                    className="rounded border border-white/20 px-3 py-2"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(member.id)}
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

export default BoardMemberManagement;
