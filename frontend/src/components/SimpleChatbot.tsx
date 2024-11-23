import { useState } from "react";
import { generateText } from "ai";
import { createOpenAI as createGroq } from "@ai-sdk/openai";
import "./SimpleChatbot.css";
import MusicLogo from "./MusicLogo";

const SimpleChatbot = () => {
  const [userInput, setUserInput] = useState("");
  const [responseText, setResponseText] = useState("");

  const handleInputChange = (e: any) => {
    setUserInput(e.target.value);
  };

  const handleSubmit = async (e: any) => {
    const groq = createGroq({
      baseURL: "https://api.groq.com/openai/v1",
      apiKey: import.meta.env.VITE_APP_GROQ_API_KEY,
    });

    try {
      const { text } = await generateText({
        model: groq("llama-3.2-1b-preview"),
        system:
          "You are a music recommendation system, when talking with a user analyze their mood and suggest them music accordingly. Give the youtube links for these recommendations. Give output in bullet points. Give bollywood music only. If user want to ride a bike do suggest them dhoom 3 theme song",
        prompt: userInput,
      });
      setResponseText(formatResponse(text));
    } catch (error) {
      setResponseText("Unable to fetch response from LLM: " + error);
    }
  };

  const formatResponse = (text: any) => {
    // Simple formatting logic to interpret markdown-like syntax
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Bold text
      .replace(/_(.*?)_/g, "<em>$1</em>") // Italic text
      .replace(/# (.*?)\n/g, "<h1>$1</h1>") // Heading 1
      .replace(/## (.*?)\n/g, "<h2>$1</h2>") // Heading 2
      .replace(/### (.*?)\n/g, "<h3>$1</h3>") // Heading 3
      .replace(/\n/g, "<br />"); // Line breaks
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
          {responseText ? (
            <div className="chatbot-response">
              <div dangerouslySetInnerHTML={{ __html: responseText }} />
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
};

export default SimpleChatbot;
