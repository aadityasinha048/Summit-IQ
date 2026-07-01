import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post("/api/gemini", async (req, res) => {
    const { type, payload } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "GEMINI_API_KEY is not configured on the server." });
    }

    const ai = new GoogleGenAI({ 
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    try {
      if (type === "recommendation") {
        const prompt = `Based on a hiker with ${payload.experience} experience and ${payload.fitnessLevel} fitness level, suggest 3 global treks. Provide name, location, and why it's a good fit. Return as JSON.`;
        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: prompt,
          config: { responseMimeType: "application/json" }
        });
        const text = response.text;
        res.json(JSON.parse(text || "[]"));
      } else if (type === "safety") {
        const { trekName, weather } = payload;
        const prompt = `Analyze the safety of trekking ${trekName} with current weather: ${JSON.stringify(weather)}. 
        Based strictly on the weather (temperature, wind, visibility, condition), provide a genuine professional recommendation on whether the trekker should START the trek now or WAIT.
        
        Return the analysis as a JSON object with this exact schema:
        {
          "status": "ready" | "caution" | "warning" | "stop",
          "recommendation": "START" | "DELAY" | "ABORT",
          "decisionBrief": "A 2-3 sentence genuine professional advice justifying the recommendation.",
          "precautions": ["At least 4 specific tactical precautions to take based on the current weather scenario"]
        }
        
        Be realistic and serious. High winds or low visibility should prompt a DELAY. Extreme cold requires specific thermal gear warnings.`;
        
        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: prompt,
          config: { responseMimeType: "application/json" }
        });
        const text = response.text;
        res.json(JSON.parse(text || "{}"));
      } else {
        res.status(400).json({ error: "Invalid request type" });
      }
    } catch (error) {
      console.error("Gemini Server Error:", error);
      res.status(500).json({ error: "Failed to communicate with AI model" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
