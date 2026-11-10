import { useEffect, useState } from "react";
import contentService from "../services/contentService";

function Mission() {
  const [mission, setMission] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    contentService
      .getMissionContent()
      .then((response) => setMission(response.data))
      .catch((error) => console.error("Mission loading failed:", error))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="bg-[#060A13] p-20 text-white">Loading mission...</div>
    );
  }

  if (!mission) {
    return (
      <div className="bg-[#060A13] p-20 text-white">
        Mission content unavailable.
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-[#060A13] px-6 py-32 text-[#E9EEF6]">
      <div className="mx-auto max-w-5xl">
        <p className="font-mono uppercase tracking-widest text-[#3EE0FF]">
          Our Purpose
        </p>
        <h1 className="mt-6 text-5xl font-bold">{mission.title}</h1>
        <p className="mt-8 max-w-3xl text-lg leading-8 text-slate-400">
          {mission.description}
        </p>
      </div>
    </section>
  );
}

export default Mission;
