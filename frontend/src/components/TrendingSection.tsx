import { useEffect, useState } from "react";
import { Crown, Medal, Trophy } from 'lucide-react';
import { responseGeneratedState, userIdState, userNameState } from "../recoil/atoms";
import { useRecoilValue } from "recoil";

interface UserRank {
  text: string;
  rank: number;
  value: number;
}

interface MoodFrequency {
  text: string;
  value: number;
}


function TrendingSection() {


  const [currentUser, setCurrentUser] = useState<UserRank | null>(null);
  const [topUsers, setTopUsers] = useState<UserRank[]>([]);
  const [moods, setMoods] = useState<MoodFrequency[]>([]);
  const userId = useRecoilValue(userIdState);
  const userName = useRecoilValue(userNameState);
  const reloadState = useRecoilValue(responseGeneratedState);

  const rankIcons = [
    <Crown key={1} className="h-6 w-6 text-yellow-400" />,
    <Medal key={2} className="h-6 w-6 text-gray-400" />,
    <Trophy key={3} className="h-6 w-6 text-amber-600" />,
    <svg key={4} xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ];

  const fetchUserRanks = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_BACKEND_URL}/api/user-ranks`
      );
      const result = await response.json();
      if (result) {
        // Find the current user from user ranks
        result.sort((a: UserRank, b: UserRank) => a.rank - b.rank);
        const currentUser = result.find(
          (user: UserRank) => user.text === userName
        );
        setCurrentUser(currentUser || null);
        setTopUsers(result.slice(0, 3));
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
      if (result) {
        // Sort moods by value in descending order
        const sortedMoods = result.sort(
          (a: MoodFrequency, b: MoodFrequency) => b.value - a.value
        );
        const topMoods = sortedMoods.slice(0, 20);
        setMoods(topMoods);
      }
    } catch (error) {
      console.error("Error fetching mood frequencies:", error);
    }
  };

  useEffect(() => {
    // Fetch user ranks

    fetchUserRanks();
    fetchMoodFrequencies();
  }, [userId]);

  
  useEffect(()=>{
    fetchUserRanks();
    fetchMoodFrequencies();
  },[reloadState])


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
  <h3 className="text-lg font-medium mb-4">User Rankings</h3>
  {/* Scrollable container for showing only 2 rankings at once */}
  <div className="space-y-3 max-h-32 overflow-y-auto">
    {topUsers.length > 0 ? (
      <>
        {topUsers.map((user, index) => (
          <div
            key={user.text}
            className="flex items-center justify-between bg-white bg-opacity-10 rounded-lg p-3"
          >
            <div className="flex items-center gap-2">
              {rankIcons[index]}
              <span className="text-sm font-semibold">{user.text}</span>
              {user.text === userName && (
                <span className="text-xs font-medium text-cyan-400">(You)</span>
              )}
            </div>
            <div className="bg-white bg-opacity-20 px-2 py-1 rounded-full">
              <span className="text-xs font-medium">Rank #{user.rank}</span>
            </div>
          </div>
        ))}
        {/* Show current user if not in top 3 */}
        {currentUser &&
          !topUsers.some((user) => user.text === currentUser.text) && (
            <div className="flex items-center justify-between bg-white bg-opacity-10 rounded-lg p-3">
              <div className="flex items-center gap-2">
                {rankIcons[3]}
                <span className="text-sm font-semibold">
                  {currentUser.text}
                </span>
                <span className="text-xs font-medium text-cyan-400">(You)</span>
              </div>
              <div className="bg-white bg-opacity-20 px-2 py-1 rounded-full">
                <span className="text-xs font-medium">
                  Rank #{currentUser.rank}
                </span>
              </div>
            </div>
          )}
      </>
    ) : (
      <span className="text-sm font-medium text-gray-400">
        Loading user rankings...
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

