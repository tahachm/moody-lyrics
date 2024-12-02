import { useState } from "react";
import { generateText } from "ai";
import { createOpenAI as createGroq } from "@ai-sdk/openai";
import { userIdState, userNameState } from "../recoil/atoms"; 
import { useRecoilValue } from "recoil"; 
import "./SimpleChatbot.css";


const SimpleChatbot = () => {
  const [userInput, setUserInput] = useState("");
  const [responseJson, setResponseJson] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const userId = useRecoilValue(userIdState); //uncomment this line once login signup is successfully implemented
    // const userId = "7"; //comment this temporary line once login signup is successfully implemented
  const userName = useRecoilValue(userNameState); 

  const handleInputChange = (e: any) => {
    setUserInput(e.target.value);
  };

  const handleSubmit = async () => {
    const groq = createGroq({
      baseURL: "https://api.groq.com/openai/v1",
      apiKey: import.meta.env.VITE_APP_GROQ_API_KEY,
    });

    try {
      const { text } = await generateText({
        model: groq("llama-3.2-1b-preview"),
        system: `
          You are a highly sophisticated song recommendation engine. Your task is to provide the best possible song recommendation 
          based on a user's emotional state, which is expressed in their query. For each user query, suggest a single song 
          that aligns with the user's current mood and situation. 
          The song recommendation should include the following:
          1. Song Name
          2. Artist Name
          3. Album Name (if applicable else "None")
          4. 3 Closest Mood Tags (e.g., happy, calm, energetic, frustrated, etc.) that best represent the mood of the user based on the query.
          5. Song Genre (e.g., rock, pop, classical, etc.)
          6. A personalized message offering encouragement, advice, or empathy that fits the user's emotional context. 
          Your response should be in JSON format only, with no additional commentary.
    
          Example:
          {
            "song": {
              "name": "Born to Be Wild",
              "artist": "Steppenwolf",
              "album": "Steppenwolf",
              "mood_tags": ["thrill", "freedom", "adrenaline"],
              "genre": "rock"
            },
            "message": "Feel the wind in your face and let the music amplify the rush! Ride safe and enjoy the adrenaline!"
          }
    
          User Query:
        `,
        prompt: userInput,
      });
    
      // Extract JSON part from the response
      const jsonMatch = text.match(/{[\s\S]*}/);
      if (jsonMatch) {
        const extractedJson = JSON.parse(jsonMatch[0]);
        setResponseJson(extractedJson); // Display the correct response
        setErrorMessage(""); // Clear any previous error messages
        console.log("extracted json", extractedJson);
        try {
          // Send data to your API
          console.log("sending data : ", JSON.stringify({
            userId : userId, // Ensure this is a UUID string
            username : userName, // Valid username
            email : userName, // Valid email
            llmResponse: {
                song: {
                    name: extractedJson?.song?.name || "Unknown",
                    artist: extractedJson?.song?.artist || "Unknown",
                    album: extractedJson?.song?.album || null,
                    genre: extractedJson?.song?.genre || null,
                    mood_tags: extractedJson?.song?.mood_tags || [],
                },
                message: extractedJson?.message || "Default message",
            },
            prompt: userInput || "Default prompt",
        }))
          await fetch(import.meta.env.VITE_APP_LAMBDA_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId : userId, // Ensure this is a UUID string
              username : userName, // Valid username
              email : userName, // Valid email
              llmResponse: {
                  song: {
                      name: extractedJson?.song?.name || "Unknown",
                      artist: extractedJson?.song?.artist || "Unknown",
                      album: extractedJson?.song?.album || null,
                      genre: extractedJson?.song?.genre || null,
                      mood_tags: extractedJson?.song?.mood_tags || [],
                  },
                  message: extractedJson?.message || "Default message",
              },
              prompt: userInput || "Default prompt",
          }),
          });
        } catch (apiError) {
          console.error("Error sending data to Lambda:", apiError);
          setErrorMessage("Failed to send data to the server, but the recommendation is displayed below.");
        }
      } else {
        setErrorMessage("Unable to parse JSON from response.");
        setResponseJson(null);
      }
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage("Error fetching response: " + error.message);
      } else {
        setErrorMessage("An unknown error occurred.");
      }
      setResponseJson(null);
    }
  };

  return (
    <>
      <div className="flex justify-center mb-12 items-center space-x-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-fuchsia-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
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
              d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
            />
          </svg>
        </div>
        <h1 className="text-5xl font-bold bg-gradient-to-r from-fuchsia-400 to-cyan-400 text-transparent bg-clip-text">
          Jam Genie
        </h1>
      </div>

      <section className="w-full mx-auto px-4 mb-12">
        <div className="bg-white bg-opacity-10 rounded-lg p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={userInput}
              onChange={handleInputChange}
              placeholder="Tell me how you're feeling..."
              className="flex-grow bg-white bg-opacity-5 text-white placeholder-gray-400 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
            />
            <button
              onClick={handleSubmit}
              className="bg-fuchsia-500 hover:bg-fuchsia-600 text-white rounded-md px-4 py-2 transition-colors duration-200"
            >
              Send
            </button>
          </div>
          {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
          {responseJson && (
  <div className="song-recommendation">
    <h2>Your Song Recommendation</h2>
    <div className="song-details">
      <div className="song-detail-item">
        <span className="song-detail-label">Song Name:</span>
        <span className="song-detail-value">{responseJson.song.name}</span>
      </div>
      <div className="song-detail-item">
        <span className="song-detail-label">Artist:</span>
        <span className="song-detail-value">{responseJson.song.artist}</span>
      </div>
      <div className="song-detail-item">
        <span className="song-detail-label">Album:</span>
        <span className="song-detail-value">{responseJson.song.album}</span>
      </div>
      <div className="song-detail-item">
        <span className="song-detail-label">Genre:</span>
        <span className="song-detail-value">{responseJson.song.genre}</span>
      </div>
      <div className="song-detail-item">
        <span className="song-detail-label">Mood Tags:</span>
        <div className="mood-tags">
          {responseJson.song.mood_tags.map((tag: string, index: number) => (
            <span key={index} className="mood-tag">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
    <div className="recommendation-message">
      {responseJson.message}
    </div>
  </div>
)}
        </div>
      </section>
    </>
  );
};

export default SimpleChatbot;
