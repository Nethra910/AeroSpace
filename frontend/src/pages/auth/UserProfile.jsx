import { useAuth } from "../../context/AuthContext";

function UserProfile() {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#060A13] text-white">
        Loading profile...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#060A13] text-white">
        Please log in to view your profile.
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-[#060A13] px-6 py-16 text-white">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10">
          <p className="mb-3 text-sm uppercase tracking-[0.3em] text-cyan-400">
            My Account
          </p>
          <h1 className="text-4xl font-bold">My Profile</h1>
          <p className="mt-3 text-slate-400">
            Manage your MANI Aerospace account.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
          <div className="flex flex-col items-center gap-5 sm:flex-row">
            <img
              src={user.profile_image}
              alt={user.name}
              className="h-28 w-28 rounded-full border-2 border-cyan-400 object-cover"
            />

            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-semibold">{user.name}</h2>
              <p className="mt-2 text-slate-400">{user.email}</p>
              <span className="mt-3 inline-block rounded-full bg-cyan-400/10 px-4 py-1 text-sm text-cyan-400">
                Google Account
              </span>
            </div>
          </div>

          <div className="my-8 border-t border-white/10" />

          <h3 className="mb-5 text-xl font-semibold">Personal Information</h3>

          <div className="space-y-5">
            <div>
              <p className="text-sm text-slate-400">Full Name</p>
              <p className="mt-1">{user.name}</p>
            </div>

            <div>
              <p className="text-sm text-slate-400">Email Address</p>
              <p className="mt-1">{user.email}</p>
            </div>

            <div>
              <p className="text-sm text-slate-400">User ID</p>
              <p className="mt-1">{user.id}</p>
            </div>
          </div>

          <div className="my-8 border-t border-white/10" />

          <button
            onClick={() => {
              logout();
              window.location.href = "/";
            }}
            className="rounded-lg border border-red-400/30 px-5 py-3 text-red-400 transition hover:bg-red-400/10"
          >
            Logout
          </button>
        </div>
      </div>
    </section>
  );
}

export default UserProfile;
