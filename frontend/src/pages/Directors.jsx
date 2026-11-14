import { useEffect, useState } from "react";
import boardMemberService from "../services/boardMemberService";
import Section from "../components/ui/Section";
import Reveal from "../components/motion/Reveal";

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
    <Section number="07" eyebrow="Leadership" title="Board of Directors" description="Meet the leadership guiding MANI Aerospace toward innovation, excellence, and the future of aerospace engineering." className="min-h-screen bg-space-950">

        {loading && (
          <p className="text-center text-muted">Loading board members...</p>
        )}

        {error && <p className="text-center text-red-400">{error}</p>}

        {!loading && !error && members.length === 0 && (
          <p className="text-center text-muted">
            No board members available yet.
          </p>
        )}

        {!loading && !error && members.length > 0 && (
          <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
            {members.map((member, index) => (
              <Reveal
                key={member.id}
                as="div"
                delay={index * 90}
                className="border border-white/10 bg-space-800 p-8"
              >
                <img
                  src={member.photo_url}
                  alt={member.name}
                  className="mb-6 h-28 w-28 rounded-full border border-signal/30 object-cover"
                />

                <h2 className="mb-2 text-2xl font-semibold">{member.name}</h2>

                {member.role && (
                  <p className="mb-4 font-mono text-xs uppercase tracking-wider text-signal">{member.role}</p>
                )}

                {member.linkedin_url && (
                  <a
                    href={member.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-muted transition hover:text-signal"
                  >
                    <span>LinkedIn</span>
                    <span>↗</span>
                  </a>
                )}
              </Reveal>
            ))}
          </div>
        )}
    </Section>
  );
}

export default Directors;
