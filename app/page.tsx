// app/page.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

type JobHit = {
  id: string;
  headline: string;
  webpage_url: string;
  logo_url: string | null;
  employer: {
    name: string;
    workplace: string;
  };
  workplace_address: {
    municipality: string | null;
    region: string | null;
  };
  description: {
    text: string;
  };
  publication_date: string;
  application_deadline: string | null;
  working_hours_type: {
    label: string;
  };
};

export default function Page() {
  const [jobs, setJobs] = useState<JobHit[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  async function getJobs(search: string) {
    setLoading(true);
    try {
      const res = await fetch(
        `https://jobsearch.api.jobtechdev.se/search?q=${encodeURIComponent(
          search
        )}&region=12&limit=100`
      );

      if (!res.ok) throw new Error("Kunde inte hämta data");
      const data = await res.json();
      setJobs(data.hits);
    } catch (error) {
      console.error(error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getJobs(query);
  }, [query]);

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    getJobs(query);
  }

  return (
    <main className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl text-black font-bold mb-6 text-center">
        Lediga jobb i Skåne
      </h1>

      {/* Profilbild */}
      <div className="flex flex-col items-center mb-10">
        <Image
          src="https://media.licdn.com/dms/image/v2/C4E03AQFqHCkjG1vONQ/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1584550181168?e=2147483647&v=beta&t=iGDbsY3Ayoe-LiZfXXPaU2dz35ln3CpG3TKR-65VfBs"
          alt="Taleb Haikal"
          width={120}
          height={120}
          className="rounded-full shadow-lg border-4 border-white"
        />
        <h2 className="mt-4 text-xl font-semibold">Taleb Haikal</h2>
        <p className="text-gray-600">Grundare & App-ägare</p>
      </div>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="flex justify-center mb-8 gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Sök jobb (t.ex. chaufför, butik, lagerarbetare)"
          className="px-4 py-2 w-80 text-black rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Sök
        </button>
      </form>

      {/* Loading state */}
      {loading && <p className="text-center text-gray-600">Laddar jobb...</p>}

      {/* Job results */}
      <div className="grid gap-6 md:grid-cols-2">
        {jobs.length > 0
          ? jobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-2xl shadow-md p-5 hover:shadow-lg transition"
              >
                <div className="flex items-center gap-4 mb-4">
                  {job.logo_url && (
                    <Image
                      src={job.logo_url}
                      alt={job.employer.name}
                      width={60}
                      height={60}
                      className="rounded-md"
                    />
                  )}
                  <div>
                    <h2 className="text-xl text-black font-semibold">
                      {job.headline}
                    </h2>
                    <p className="text-gray-600">
                      {job.employer?.workplace || job.employer?.name}
                    </p>
                  </div>
                </div>

                {/* Datum */}
                <div className="text-sm text-gray-500 mb-3">
                  jobb type: <strong>{job.working_hours_type.label}</strong>
                  <br /> Publicerad:{" "}
                  {new Date(job.publication_date).toLocaleDateString("sv-SE")}
                  <br /> Sista ansökningsdag:{" "}
                  {job.application_deadline
                    ? new Date(job.application_deadline).toLocaleDateString(
                        "sv-SE"
                      )
                    : "Ej angiven"}
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {job.workplace_address?.municipality},{" "}
                    {job.workplace_address?.region}
                  </span>
                  <a
                    href={job.webpage_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Se annons →
                  </a>
                </div>
              </div>
            ))
          : !loading && (
              <p className="text-center text-gray-500">
                Inga jobb hittades för {query}.
              </p>
            )}
      </div>
    </main>
  );
}
