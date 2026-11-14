import { useEffect, useState } from "react";
import teamMemberService from "../services/teamMemberService";
import Section from "../components/ui/Section";
import Reveal from "../components/motion/Reveal";

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
    <Section
      number="06"
      eyebrow="Crew Manifest"
      title={<>Team <span className="text-signal">SIMHA</span></>}
      description="Team SIMHA brings together aerospace engineering, research, and innovation to explore next-generation technologies and future aerospace possibilities."
      className="min-h-screen bg-space-900"
    >

        <div className="mt-10 grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="text-3xl font-semibold">
              Engineering the Future Together
            </h2>

            <p className="font-mono text-xs uppercase tracking-widest text-muted">Manifest / Active roster</p>
          </div>

          <div className="flex min-h-80 items-center justify-center border border-white/10 bg-space-950">
            <span className="text-6xl font-bold tracking-widest text-signal">
              SIMHA
            </span>
          </div>
        </div>

        <div className="mt-20">
          <h2 className="text-3xl font-semibold">Meet Our Team</h2>

          {loading ? (
            <p className="mt-6 text-muted">Loading team members...</p>
          ) : error ? (
            <p className="mt-6 text-red-400">{error}</p>
          ) : members.length === 0 ? (
            <p className="mt-6 text-muted">
              Team member profiles will be added soon.
            </p>
          ) : (
            <div className="mt-10 grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
              {members.map((member, index) => (
                <Reveal
                  key={member.id}
                  as="article"
                  delay={index * 80}
                  className="overflow-hidden border border-white/10 bg-space-800"
                >
                  {member.image_url ? (
                    <img
                      src={member.image_url}
                      alt={member.name}
                      className="h-72 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-72 items-center justify-center bg-space-900">
                    <span className="text-5xl font-bold text-signal">
                        {member.name.charAt(0)}
                      </span>
                    </div>
                  )}

                  <div className="p-6">
                    <h3 className="text-xl font-semibold">{member.name}</h3>
                    <p className="mt-2 font-mono text-xs uppercase tracking-wider text-signal">{member.designation}</p>
                    <p className="mt-2 text-sm text-muted">
                      {member.specialization}
                    </p>
                    <p className="mt-4 leading-relaxed text-muted">
                      {member.bio}
                    </p>

                    {member.education && (
                      <p className="mt-4 text-sm text-muted">
                        Education: {member.education}
                      </p>
                    )}

                    {member.skills && (
                      <p className="mt-2 text-sm text-muted">
                        Skills: {member.skills}
                      </p>
                    )}

                    {member.linkedin_url && (
                      <a
                        href={member.linkedin_url}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-4 inline-block text-signal hover:underline"
                      >
                        LinkedIn Profile →
                      </a>
                    )}
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </div>
    </Section>
  );
}

export default TeamSimha;
