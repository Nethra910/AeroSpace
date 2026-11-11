import GoogleLoginButton from "../../components/auth/GoogleLoginButton";

function UserLogin() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#060A13] px-6">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-white">
        <h1 className="mb-3 text-3xl font-bold">Welcome to MANI Aerospace</h1>

        <p className="mb-8 text-gray-400">
          Sign in or create an account to access research paper features.
        </p>

        <div className="flex justify-center">
          <GoogleLoginButton />
        </div>
      </div>
    </div>
  );
}

export default UserLogin;
