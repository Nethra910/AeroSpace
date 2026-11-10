import { useEffect, useState } from "react";
import boardMemberService from "../services/boardMemberService";

function Directors() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await boardMemberService.getPublicMembers();
        setMembers(response.data);
      } catch (err) {
        setError("Unable to load board members. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  return (
    <section className="min-h-screen bg-[#060A13] px-6 py-20 text-[#E9EEF6]">
      <div className="mx-auto max-w-7xl">
        <p className="mb-4 text-sm uppercase tracking-[0.3em] text-[#3EE0FF]">
          Leadership
        </p>

        <h1 className="mb-6 text-4xl font-bold md:text-6xl">
          Board of Directors
        </h1>

        <p className="mb-16 max-w-2xl text-lg leading-8 text-slate-400">
          Meet the leadership guiding MANI Aerospace toward innovation,
          excellence, and the future of aerospace engineering.
        </p>

        {loading && (
          <p className="text-center text-slate-400">Loading board members...</p>
        )}

        {error && <p className="text-center text-red-400">{error}</p>}

        {!loading && !error && members.length === 0 && (
          <p className="text-center text-slate-400">
            No board members available yet.
          </p>
        )}

        {!loading && !error && members.length > 0 && (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {members.map((member) => (
              <div
                key={member.id}
                className="rounded-xl border border-[#1D2940] bg-[#0C1322] p-8 transition hover:border-[#3EE0FF]/50"
              >
                <img
                  src={member.photo_url}
                  alt={member.name}
                  className="mb-6 h-28 w-28 rounded-full border border-[#3EE0FF]/30 object-cover"
                />

                <h2 className="mb-2 text-2xl font-semibold">{member.name}</h2>

                {member.role && (
                  <p className="mb-4 text-[#3EE0FF]">{member.role}</p>
                )}

                {member.linkedin_url && (
                  <a
                    href={member.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-slate-400 transition hover:text-[#3EE0FF]"
                  >
                    <span>LinkedIn</span>
                    <span>↗</span>
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Directors;
