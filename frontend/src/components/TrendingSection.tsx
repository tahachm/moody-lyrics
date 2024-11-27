import { useEffect, useState } from "react";
import { Crown } from "lucide-react";
import { userIdState } from "../recoil/atoms";
import { useRecoilValue } from "recoil";

interface UserRank {
  username: string;
  rank: number;
  response_count: number;
}

interface MoodFrequency {
  text: string;
  value: number;
}


function TrendingSection() {


  const [topUser, setTopUser] = useState<UserRank | null>(null);
  const [moods, setMoods] = useState<MoodFrequency[]>([]);
  const userId = useRecoilValue(userIdState);

  useEffect(() => {
    // Fetch user ranks
    const fetchUserRanks = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_APP_BACKEND_URL}/api/user-ranks`
        );
        const result = await response.json();
        if (result.user_ranks) {
          // Find the current user from user ranks
          const currentUser = result.user_ranks.find(
            (user: UserRank) => user.username === userId
          );
          setTopUser(currentUser || null);
        }
      } catch (error) {
        console.error("Error fetching user ranks:", error);
      }
    };

    // Fetch mood frequencies
    const fetchMoodFrequencies = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_APP_BACKEND_URL}/api/mood-frequencies`
        );
        const result = await response.json();
        if (result.mood_frequencies) {
          // Sort moods by value in descending order
          const sortedMoods = result.mood_frequencies.sort(
            (a: MoodFrequency, b: MoodFrequency) => b.value - a.value
          );
          setMoods(sortedMoods);
        }
      } catch (error) {
        console.error("Error fetching mood frequencies:", error);
      }
    };

    fetchUserRanks();
    fetchMoodFrequencies();
  }, [userId]);


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
        {/* User Ranking Section */}
        <div className="bg-gradient-to-br from-fuchsia-500 to-cyan-500 bg-opacity-10 rounded-lg p-6">
          <h3 className="text-lg font-medium mb-4">User Ranking</h3>
          <div className="flex items-center justify-between bg-white bg-opacity-10 rounded-lg p-4">
            {topUser ? (
              <>
                <div className="flex items-center gap-3">
                  <Crown className="h-6 w-6 text-yellow-400" />
                  <span className="text-lg font-semibold">{topUser.username}</span>
                </div>
                <div className="bg-white bg-opacity-20 px-3 py-1 rounded-full">
                  <span className="text-sm font-medium">
                    Rank #{topUser.rank}
                  </span>
                </div>
              </>
            ) : (
              <span className="text-sm font-medium text-gray-400">
                Loading user ranking...
              </span>
            )}
          </div>
        </div>

        {/* Popular Moods Section */}
        <div className="bg-gradient-to-br from-fuchsia-500 to-cyan-500 bg-opacity-10 rounded-lg p-6">
          <h3 className="text-lg font-medium mb-2">Popular Moods</h3>
          <div className="flex flex-wrap gap-2">
            {moods.length > 0 ? (
              moods.map((mood, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-full text-sm bg-white bg-opacity-10 hover:bg-opacity-20 cursor-pointer transition-colors duration-200"
                >
                  {mood.text}
                </span>
              ))
            ) : (
              <span className="text-sm font-medium text-gray-400">
                Loading most popular moods...
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default TrendingSection;

