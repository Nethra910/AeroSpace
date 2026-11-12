import { useEffect, useState } from "react";
import teamMemberService from "../../services/teamMemberService";

const emptyForm = {
  name: "",
  designation: "",
  specialization: "",
  bio: "",
  image_url: "",
  education: "",
  skills: "",
  linkedin_url: "",
};

function TeamManagement() {
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
      const response = await teamMemberService.getAllMembers();
      setMembers(response.data);
    } catch {
      setError("Unable to load team members.");
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
      let imageUrl = form.image_url;

      if (imageFile) {
        const response = await teamMemberService.uploadImage(imageFile);
        imageUrl = response.data.image_url;
      }

      const payload = {
        ...form,
        image_url: imageUrl.trim() || null,
        education: form.education.trim() || null,
        skills: form.skills.trim() || null,
        linkedin_url: form.linkedin_url.trim() || null,
      };

      if (editingId) {
        await teamMemberService.updateMember(editingId, payload);
      } else {
        await teamMemberService.createMember(payload);
      }

      resetForm();
      await loadMembers();
    } catch {
      setError("Unable to save team member or upload image.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (member) => {
    setEditingId(member.id);
    setImageFile(null);

    setForm({
      name: member.name || "",
      designation: member.designation || "",
      specialization: member.specialization || "",
      bio: member.bio || "",
      image_url: member.image_url || "",
      education: member.education || "",
      skills: member.skills || "",
      linkedin_url: member.linkedin_url || "",
    });

    setPreview(member.image_url || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this member?")) return;

    try {
      await teamMemberService.deleteMember(id);
      await loadMembers();
    } catch {
      setError("Unable to delete team member.");
    }
  };

  const handleStatus = async (id) => {
    try {
      await teamMemberService.toggleStatus(id);
      await loadMembers();
    } catch {
      setError("Unable to change member status.");
    }
  };

  const fields = [
    { name: "name", required: true },
    { name: "designation", required: true },
    { name: "specialization", required: true },
    { name: "education" },
    { name: "skills" },
    { name: "linkedin_url" },
    { name: "bio", required: true, multiline: true },
  ];

  return (
    <section className="min-h-screen bg-space-950 px-6 py-16 text-white">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-4xl font-bold">Manage Team SIMHA</h1>

        {error && <p className="mt-4 text-red-400">{error}</p>}

        <form
          onSubmit={handleSubmit}
          className="mt-10 grid gap-4 rounded-xl border border-white/10 bg-space-800 p-6"
        >
          <h2 className="text-2xl font-semibold">
            {editingId ? "Edit Member" : "Add Team Member"}
          </h2>

          {fields.map((field) => (
            <label key={field.name} className="grid gap-2 capitalize">
              {field.name.replace("_", " ")}
              {field.multiline ? (
                <textarea
                  name={field.name}
                  value={form[field.name]}
                  onChange={handleChange}
                  rows={5}
                  required={field.required}
                  className="rounded-md border border-white/10 bg-space-950 p-3"
                />
              ) : (
                <input
                  name={field.name}
                  value={form[field.name]}
                  onChange={handleChange}
                  required={field.required}
                  className="rounded-md border border-white/10 bg-space-950 p-3"
                />
              )}
            </label>
          ))}

          <label className="grid gap-2">
            Upload Member Image
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
              alt="Member preview"
              className="h-56 w-56 rounded-lg border border-white/10 object-cover"
            />
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
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

        <h2 className="mt-16 text-2xl font-semibold">Existing Members</h2>

        {loading ? (
          <p className="mt-6 text-muted">Loading members...</p>
        ) : (
          <div className="mt-6 grid gap-4">
            {members.map((member) => (
              <article
                key={member.id}
                className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-white/10 bg-space-800 p-5"
              >
                <div className="flex items-center gap-4">
                  {member.image_url && (
                    <img
                      src={member.image_url}
                      alt={member.name}
                      className="h-20 w-20 rounded-md object-cover"
                    />
                  )}

                  <div>
                    <h3 className="font-semibold">{member.name}</h3>
                    <p className="text-sm text-muted">
                      {member.designation} · {member.specialization}
                    </p>
                    <p className="mt-1 text-sm">
                      {member.is_active ? "Active" : "Inactive"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleEdit(member)}
                    className="rounded border border-white/20 px-3 py-2"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleStatus(member.id)}
                    className="rounded border border-signal px-3 py-2 text-signal"
                  >
                    {member.is_active ? "Deactivate" : "Activate"}
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

export default TeamManagement;
