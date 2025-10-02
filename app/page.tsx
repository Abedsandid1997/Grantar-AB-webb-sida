// app/page.tsx
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
};

async function getJobs(): Promise<JobHit[]> {
  const res = await fetch(
    "https://jobsearch.api.jobtechdev.se/search?q=lagerarbetare&region=12&limit=100"
  );

  if (!res.ok) throw new Error("Kunde inte hämta data");

  const data = await res.json();
  return data.hits;
}

export default async function Page() {
  const jobs = await getJobs();

  return (
    <main className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Lediga jobb inom lager
      </h1>

      {/* Profilbild i mitten */}
      <div className="flex flex-col items-center mb-10">
        <Image
          src="https://media.licdn.com/dms/image/v2/C4E03AQFqHCkjG1vONQ/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1584550181168?e=2147483647&v=beta&t=iGDbsY3Ayoe-LiZfXXPaU2dz35ln3CpG3TKR-65VfBs"
          alt="Taleb Haikal"
          width={120}
          height={120}
          className="rounded-full shadow-lg border-4 border-white"
        />
        <h2 className="mt-4 text-xl font-semibold">Taleb Haikal</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {jobs.map((job) => (
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
                <h2 className="text-xl font-semibold">{job.headline}</h2>
                <p className="text-gray-600">
                  {job.employer?.workplace || job.employer?.name}
                </p>
              </div>
            </div>

            <p className="text-gray-700 line-clamp-4 mb-4">
              {job.description?.text}
            </p>

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
        ))}
      </div>
    </main>
  );
}
