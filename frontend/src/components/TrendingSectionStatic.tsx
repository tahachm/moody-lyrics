import { Crown } from 'lucide-react'

function TrendingSectionStatic() {
  const moods = [
    "Happy",
    "Melancholic",
    "Energetic",
    "Calm",
    "Romantic",
    "Focused",
    "Nostalgic",
    "Excited",
  ];

  // Dummy data for the top user
  const topUser = {
    username: "MusicMaster42",
    rank: 1
  };

  return (
    <section className="mb-10">
      <div className="flex items-center gap-2 mb-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-cyan-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
          />
        </svg>
        <h2 className="text-xl font-semibold">Trending Now</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="bg-gradient-to-br from-fuchsia-500 to-cyan-500 bg-opacity-10 rounded-lg p-6">
          <h3 className="text-lg font-medium mb-4">User Ranking</h3>
          <div className="flex items-center justify-between bg-white bg-opacity-10 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Crown className="h-6 w-6 text-yellow-400" />
              <span className="text-lg font-semibold">{topUser.username}</span>
            </div>
            <div className="bg-white bg-opacity-20 px-3 py-1 rounded-full">
              <span className="text-sm font-medium">Rank #{topUser.rank}</span>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-fuchsia-500 to-cyan-500 bg-opacity-10 rounded-lg p-6">
          <h3 className="text-lg font-medium mb-2">Popular Moods</h3>
          <div className="flex flex-wrap gap-2">
            {moods.map((mood, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-full text-sm bg-white bg-opacity-10 hover:bg-opacity-20 cursor-pointer transition-colors duration-200"
              >
                {mood}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default TrendingSectionStatic;

