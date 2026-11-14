import { useAuth } from "../../context/AuthContext";
import Badge from "../../components/ui/Badge";
import Section from "../../components/ui/Section";

function UserProfile() {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-space-950 text-ink">
        Loading profile...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-space-950 text-ink">
        Please log in to view your profile.
      </div>
    );
  }

  return (
    <Section number="05" eyebrow="My Account" title="My Profile" description="Manage your MANI Aerospace account." className="min-h-screen bg-space-950">
      <div className="max-w-3xl">
        <div className="border border-white/10 bg-space-800 p-8">
          <div className="flex flex-col items-center gap-5 sm:flex-row">
            <img
              src={user.profile_image}
              alt={user.name}
              className="h-28 w-28 rounded-full border-2 border-signal object-cover"
            />

            <div className="max-w-full min-w-0 text-center sm:text-left">
              <h2 className="text-2xl font-semibold">{user.name}</h2>
              <p className="mt-2 text-muted">{user.email}</p>
              <div className="mt-3"><Badge tone="signal">Google Account</Badge></div>
            </div>
          </div>

          <div className="my-8 border-t border-white/10" />

          <h3 className="mb-5 text-xl font-semibold">Personal Information</h3>

          <div className="space-y-5">
            <div>
              <p className="text-sm text-muted">Full Name</p>
              <p className="mt-1">{user.name}</p>
            </div>

            <div>
              <p className="text-sm text-muted">Email Address</p>
              <p className="mt-1">{user.email}</p>
            </div>

            <div>
              <p className="text-sm text-muted">User ID</p>
              <p className="mt-1">{user.id}</p>
            </div>
          </div>

          <div className="my-8 border-t border-white/10" />

          <button
            onClick={() => {
              logout();
              window.location.href = "/";
            }}
            className="rounded-md border border-danger/30 px-5 py-3 text-danger transition hover:bg-danger/10"
          >
            Logout
          </button>
        </div>
      </div>
    </Section>
  );
}

export default UserProfile;
