import { useEffect, useState } from "react";
import { responseGeneratedState, userIdState } from "./recoil/atoms"; 
import { useRecoilValue } from "recoil"; 


interface Song {
  id: number
  name: string
  description: string
}

export default function SuggestedSongs() {

  const [suggestedSongs, setSuggestedSongs] = useState<Song[]>([]);
  const userId = useRecoilValue(userIdState); // Get user ID from Recoil state
  const reloadSuggestions = useRecoilValue(responseGeneratedState); // Get user ID from Recoil state
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  const fetchSuggestions = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_BACKEND_URL}/api/recent-suggestions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user_id: userId }), // Pass the user_id in the request body
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch suggestions");
      }

      const data = await response.json();
      // Map the API response to the expected structure
      const formattedData = data.map((item: any, index: number) => ({
        id: index,
        name: item.song_name,
        description: `By ${item.artist} | Suggested on ${new Date(item.created_at).toLocaleDateString()}`,
      }));

      setSuggestedSongs(formattedData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch recently suggested songs
    if (userId) {
      fetchSuggestions();
    }
  }, [userId]);

  useEffect(()=>{
    if (userId) {
      fetchSuggestions();
    }
  },[reloadSuggestions])



  return (
    <div className="max-w-7xl mx-auto px-4 space-y-12 pb-12">
      {/* Recent Suggestions */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-fuchsia-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h2 className="text-xl font-semibold">Recently Suggested</h2>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="text-center text-gray-300">Loading suggestions...</div>
        )}

        {/* Error state */}
        {error && (
          <div className="text-center text-red-500">
            Error: {error}
          </div>
        )}

        {/* No Suggestions State */}
        {!loading && suggestedSongs.length === 0 && !error && (
          <div className="text-center text-gray-300">
            No suggestions currently!
          </div>
        )}

        {/* Suggestions Grid */}
        {suggestedSongs.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {suggestedSongs.map((song) => (
              <div
                key={song.id}
                className="bg-white bg-opacity-5 rounded-lg p-4 hover:bg-opacity-10 transition-colors duration-200 cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-fuchsia-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-white group-hover:text-fuchsia-400 transition-colors">
                      {song.name}
                    </h3>
                  </div>
                </div>
                <p className="text-sm text-left text-gray-300 mt-3 line-clamp-2">
                  {song.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );

}

