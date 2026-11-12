import { useLocation } from "react-router-dom";
import GoogleLoginButton from "../../components/auth/GoogleLoginButton";

function UserLogin() {
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || "/";

  return (
    <div className="page-grid relative flex min-h-screen items-center justify-center overflow-hidden bg-space-950 px-6 py-16">
      <div className="pointer-events-none absolute left-8 top-8 font-mono text-[10px] uppercase tracking-[0.25em] text-muted md:left-12 md:top-12">
        AUTH / USER ACCESS / 01
      </div>
      <div className="pointer-events-none absolute bottom-8 right-8 font-mono text-[10px] uppercase tracking-[0.25em] text-muted md:bottom-12 md:right-12">
        REV 2036 / USER ACCESS
      </div>

      <div className="relative w-full max-w-md border border-white/10 bg-[#111a26] p-8 text-white shadow-2xl md:p-10">
        <div className="mb-8 flex items-center justify-between border-b border-white/10 pb-5">
          <div className="font-mono text-xs font-semibold tracking-[0.18em]">
            MANI <span className="text-signal">/ AEROSPACE</span>
          </div>
          <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-[#7ed39c]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#7ed39c]" />
            Online
          </span>
        </div>

        <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#61d6d1]">
          Research network
        </p>
        <h1 className="mb-3 mt-4 text-3xl font-bold tracking-tight">
          Welcome to MANI Aerospace
        </h1>

        <p className="mb-8 text-sm leading-7 text-muted">
          Sign in or create an account to access research paper features.
        </p>

        <div className="flex min-h-12 justify-center">
          <GoogleLoginButton redirectTo={redirectTo} />
        </div>

        <p className="mt-8 border-t border-white/10 pt-5 font-mono text-[10px] uppercase leading-5 tracking-wider text-muted">
          Continue with Google to access submissions and your research profile.
        </p>
      </div>
    </div>
  );
}

export default UserLogin;
