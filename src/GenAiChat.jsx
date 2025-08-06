import React, { useState } from "react";
import { GoogleGenAI } from "@google/genai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Advanced cleaning function
// const cleanResponse = (text) => {
//   return (
//     text
//       // Remove code blocks
//       .replace(/```[\s\S]*?```/g, "")
//       // Remove inline code
//       .replace(/`([^`]+)`/g, "$1")
//       // Remove bold and italic
//       .replace(/\*\*(.*?)\*\*/g, "$1")
//       .replace(/\*(.*?)\*/g, "$1")
//       // Remove links but keep text
//       .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
//       // Remove headers
//       .replace(/^#{1,6}\s+.*$/gm, "")
//       // Remove list markers
//       .replace(/^[\s]*[-*+]\s+/gm, "")
//       .replace(/^[\s]*\d+\.\s+/gm, "")
//       .trim()
//   );
// };

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
      const quizPrompt = `Generate a quiz with 5 multiple choice questions about ${prompt}. 
      Return ONLY a valid JSON object with no additional text, markdown, or code blocks.
      The JSON must strictly follow this format:
      {
        "questions": [
          {
            "question": "string",
            "options": ["string", "string", "string", "string"],
            "correctAnswer": "string"
          }
        ]
      }`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: quizPrompt,
      });
      let result = response.text;
      console.log(result);
      // Clean the response
      // result = cleanResponse(result);
      let cleanedResponse = result
        .replace(/```json\n?/g, "") // Remove ```json
        .replace(/```\n?/g, "") // Remove ```
        .trim(); // Remove extra whitespace

      const quizData = JSON.parse(cleanedResponse);
      setResponseText(quizData.questions.map((question) => question.question));
    } catch (error) {
      console.error("Error:", error);
      setResponseText("Error: " + error.message);
    }

    setLoading(false);
  };

  return (
    <>
      <div>
        <h2>ASK GEMINI</h2>
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
        {loading ? "Thinking..." : "Answer"}
      </button>
      <div
        style={{
          width: "80vw",
          minHeight: "100px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <strong>Response:</strong>
        <p
          style={{
            height: "auto",
            minHeight: "500px",
            width: "100%",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            textAlign: "left",
            backgroundColor: "#3B3B3B",
            color: "lightgray",
            padding: 10,
            borderRadius: 10,
            overflowY: "auto",
            boxSizing: "border-box",
          }}
        >
          {responseText}
        </p>
      </div>
    </>
  );
};

export default GenAiChat;
