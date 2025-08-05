import React, { useState } from "react";
import { GoogleGenAI } from "@google/genai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Advanced cleaning function
const cleanResponse = (text) => {
  return (
    text
      // Remove code blocks
      .replace(/```[\s\S]*?```/g, "")
      // Remove inline code
      .replace(/`([^`]+)`/g, "$1")
      // Remove bold and italic
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g, "$1")
      // Remove links but keep text
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      // Remove headers
      .replace(/^#{1,6}\s+.*$/gm, "")
      // Remove list markers
      .replace(/^[\s]*[-*+]\s+/gm, "")
      .replace(/^[\s]*\d+\.\s+/gm, "")
      .trim()
  );
};

const GenAiChat = () => {
  const [responseText, setResponseText] = useState("");
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");

  // Create a single client object
  const ai = new GoogleGenAI({
    apiKey: API_KEY,
  });

  const handleGemini = async () => {
    setLoading(true);
    setResponseText("");
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });
      let result = response.text;
      console.log(result);
      // Clean the response
      result = cleanResponse(result);
      setResponseText(result);
    } catch (error) {
      console.error("Error:", error);
      setResponseText("Error: " + error.message);
    }

    setLoading(false);
  };

  return (
    <>
      <div>
        <h2>Gen AI Chat</h2>
        <textarea
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={10}
          cols={50}
          placeholder="Enter your prompt here"
        />
      </div>
      <button
        style={{ marginTop: 10, marginBottom: 10 }}
        onClick={handleGemini}
      >
        {loading ? "Thinking..." : "Generate"}
      </button>
      <div
        style={{
          width: "80vw",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <strong>Response:</strong>
        <p
          style={{
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            textAlign: "left",
            backgroundColor: "#3B3B3B",
            color: "lightgray",
            padding: 10,
            borderRadius: 10,
          }}
        >
          {responseText}
        </p>
      </div>
    </>
  );
};

export default GenAiChat;
