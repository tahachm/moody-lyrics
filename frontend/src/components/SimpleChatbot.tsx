import { useState } from "react";
// import { generateText } from "ai";
// import { createOpenAI as createGroq } from "@ai-sdk/openai";
import { responseGeneratedState, userIdState, userNameState } from "../recoil/atoms"; 
import { useRecoilState, useRecoilValue } from "recoil"; 
import "./SimpleChatbot.css";


const SimpleChatbot = () => {
  const [userInput, setUserInput] = useState("");
  const [responseJson, setResponseJson] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [reloadState,setReloadState] = useRecoilState(responseGeneratedState);

  const userId = useRecoilValue(userIdState); //uncomment this line once login signup is successfully implemented
    // const userId = "7"; //comment this temporary line once login signup is successfully implemented
  const userName = useRecoilValue(userNameState); 

  const handleInputChange = (e: any) => {
    setUserInput(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      // Send user input to Lambda
      const response = await fetch(import.meta.env.VITE_APP_LAMBDA_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId, // User ID (UUID)
          username: userName, // Username
          email: userName, // Placeholder for email
          userInput, // Text input from the user
        }),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to fetch response: ${response.statusText}`);
      }
  
      const data = await response.json();
      setResponseJson(data.llmResponse); // Display the response
      setErrorMessage("");
      setReloadState(!reloadState);

    } catch (error) {
      console.error("Error communicating with Lambda:", error);
      setErrorMessage("Failed to process your request. Please try again later.");
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
