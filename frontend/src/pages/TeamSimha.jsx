import { useEffect, useState } from "react";
import teamMemberService from "../services/teamMemberService";

function TeamSimha() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadMembers = async () => {
      try {
        const response = await teamMemberService.getActiveMembers();
        setMembers(response.data);
      } catch {
        setError("Unable to load team members.");
      } finally {
        setLoading(false);
      }
    };

    loadMembers();
  }, []);

  return (
    <section className="min-h-screen bg-[#0A101D] px-6 py-28 text-white">
      <div className="mx-auto max-w-7xl">
        <p className="font-mono text-sm uppercase tracking-widest text-cyan-400">
          Our Team
        </p>

        <h1 className="mt-6 text-5xl font-bold md:text-7xl">
          Team <span className="text-cyan-400">SIMHA</span>
        </h1>

        <div className="mt-10 grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="text-3xl font-semibold">
              Engineering the Future Together
            </h2>

            <p className="mt-6 leading-relaxed text-slate-400">
              Team SIMHA brings together aerospace engineering, research, and
              innovation to explore next-generation technologies and future
              aerospace possibilities.
            </p>
          </div>

          <div className="flex min-h-80 items-center justify-center rounded-xl border border-white/10 bg-slate-900">
            <span className="text-6xl font-bold tracking-widest text-cyan-400">
              SIMHA
            </span>
          </div>
        </div>

        <div className="mt-20">
          <h2 className="text-3xl font-semibold">Meet Our Team</h2>

          {loading ? (
            <p className="mt-6 text-slate-400">Loading team members...</p>
          ) : error ? (
            <p className="mt-6 text-red-400">{error}</p>
          ) : members.length === 0 ? (
            <p className="mt-6 text-slate-400">
              Team member profiles will be added soon.
            </p>
          ) : (
            <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {members.map((member) => (
                <article
                  key={member.id}
                  className="overflow-hidden rounded-xl border border-white/10 bg-slate-900"
                >
                  {member.image_url ? (
                    <img
                      src={member.image_url}
                      alt={member.name}
                      className="h-72 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-72 items-center justify-center bg-slate-800">
                      <span className="text-5xl font-bold text-cyan-400">
                        {member.name.charAt(0)}
                      </span>
                    </div>
                  )}

                  <div className="p-6">
                    <h3 className="text-xl font-semibold">{member.name}</h3>
                    <p className="mt-2 text-cyan-400">{member.designation}</p>
                    <p className="mt-2 text-sm text-slate-400">
                      {member.specialization}
                    </p>
                    <p className="mt-4 leading-relaxed text-slate-300">
                      {member.bio}
                    </p>

                    {member.education && (
                      <p className="mt-4 text-sm text-slate-400">
                        Education: {member.education}
                      </p>
                    )}

                    {member.skills && (
                      <p className="mt-2 text-sm text-slate-400">
                        Skills: {member.skills}
                      </p>
                    )}

                    {member.linkedin_url && (
                      <a
                        href={member.linkedin_url}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-4 inline-block text-cyan-400 hover:underline"
                      >
                        LinkedIn Profile →
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default TeamSimha;
