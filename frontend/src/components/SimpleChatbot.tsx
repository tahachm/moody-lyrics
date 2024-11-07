import { useState, useEffect } from "react";
import { generateText } from "ai";
import { createOpenAI as createGroq } from "@ai-sdk/openai";

const SimpleChatbot = () => {
    const [responseText, setResponseText] = useState("");

    useEffect(() => {
        const fetchResponse = async () => {
            const groq = createGroq({
                baseURL: "https://api.groq.com/openai/v1",
                // apiKey: process.env.GROQ_API_KEY,
                apiKey: "placeholder",
            });

            try {
                const { text } = await generateText({
                    model: groq("llama-3.1-405b-reasoning"),
                    prompt: "What is love?",
                });
                setResponseText(text);
            } catch (error) {
                setResponseText("Unable to fetch response from LLM: " + error);
            }
        };

        fetchResponse();
    }, []);

    return <p>LLM response: {responseText}</p>;
};

export default SimpleChatbot;
