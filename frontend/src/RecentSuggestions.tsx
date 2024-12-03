import { useEffect, useState } from "react";
import { responseGeneratedState, userIdState } from "./recoil/atoms"; 
import { useRecoilValue } from "recoil"; 


interface Song {
  id: number
  name: string
  artist_name:string
  description: string
}



export default function SuggestedSongs() {


  const [suggestedSongs, setSuggestedSongs] = useState<Song[]>([]);
  const userId = useRecoilValue(userIdState); // Get user ID from Recoil state
  const reloadSuggestions = useRecoilValue(responseGeneratedState); // Get user ID from Recoil state
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState<string | null>(null); 


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
        artist_name: item.artist,
        description: `${item.created_at}`,
      }));

      setSuggestedSongs(formattedData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      // Fetch recently suggested songs
      if (userId) {
        await fetchSuggestions();
      }
    };
  
    fetchData();
  }, [userId]);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch recently suggested songs
      if (userId) {
        await fetchSuggestions();
      }
    };
  
    fetchData();
  }, [reloadSuggestions]);



  return (
    <div className="max-w-7xl px-4 space-y-12 pb-12">
        {/* Recent Suggestions */}
        <section>
        <div className="mb-6">
      <div className="flex items-center gap-2">
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
            <div className="text-center text-gray-300 mt-2">
              Loading suggestions...
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="text-center text-red-500 mt-2">
              Error: {error}
            </div>
          )}

          {/* No Suggestions State */}
          {suggestedSongs.length === 0 && !loading && !error && (
            <div className="text-center text-gray-300 mt-2">
              No suggestions found.
            </div>
          )}
        </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">


            {suggestedSongs.length>0 && suggestedSongs.map((song, i) => (
              <div 
                key={i} 
                className="bg-white bg-opacity-5 rounded-lg p-4 hover:bg-opacity-10 transition-colors duration-200 cursor-pointer min-w-32 !min-h-16 text-left"
              >
                <div className="flex !min-h-16 items-start gap-3">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-fuchsia-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg text-left text-white group-hover:text-fuchsia-400 transition-colors">
                      {song.name}
                    </h3>
                    <h3 className="text-xs italic text-left text-white group-hover:text-fuchsia-400 transition-colors">
                      {song.artist_name}
                    </h3>
                  </div>
                </div>
                <p className="text-sm text-left text-gray-300 mt-3 line-clamp-2">
                  {song.description} 
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
  )
}
