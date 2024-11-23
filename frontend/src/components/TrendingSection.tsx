function TrendingSection() {
  const keywords = [
    "Love",
    "Dance",
    "Chill",
    "Energy",
    "Motivation",
    "Relax",
    "Party",
    "Focus",
    "Workout",
    "Sleep",
  ];

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
          <h3 className="text-lg font-medium mb-2">Top Keywords</h3>
          <div className="flex flex-wrap gap-2">
            {keywords.map((keyword, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-full text-sm bg-white bg-opacity-10 hover:bg-opacity-20 cursor-pointer transition-colors duration-200"
              >
                {keyword}
              </span>
            ))}
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

export default TrendingSection;
