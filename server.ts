import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI, Type } from "@google/genai";

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
      } else if (type === "plan") {
        const prompt = `You are an elite, experienced mountain expedition planner and chief safety officer. 
        Your task is to analyze the user's trek planning request or general question, and perform an autonomous multi-step reasoning process using SummitIQ internal modules (Trek Intelligence, Weather Intel, Altitude Tracker, Health Monitor, Packing Assistant, Budget Estimator, Emergency SOS) as your internal tools.

        User Request: "${payload.prompt}"
        User Details (if provided in their profile or request):
        - Age: ${payload.age || 'Unknown'}
        - Experience: ${payload.experience || 'Beginner'}
        - Fitness Level: ${payload.fitnessLevel || 'Moderate'}
        - Health Conditions: ${payload.healthConditions || 'None'}
        - Budget limit: ${payload.budget || 'Flexible'}
        - Owned Gear: ${payload.ownedGear || 'None'}

        First, analyze the user's request:
        1. Is it a general question, advice inquiry, request for suggestions, comparative question, or discussion (e.g. "What are some easy treks?", "What are the symptoms of AMS?", "How to train for a trek?", "Which is better: EBC or Roopkund?", "Do you support offline mode?")?
           If so, set "isGeneralQuestion" to true, and provide a rich, helpful, friendly, and complete markdown formatted response in "generalResponse" answering their question comprehensively. Set "requiresClarification" to false, and leave "report" out or null.
        
        2. Is it a specific trek planning request? (e.g. "Kedarkantha Trek next weekend...", "Everest Base Camp in early October...", "I want to do EBC")
           If so, set "isGeneralQuestion" to false:
           - If the request is too vague to plan (e.g., they just say "I want to go trekking" without specifying any destination/trek, or they don't provide enough details to do any planning), set "requiresClarification" to true, and provide 2-3 specific "clarificationQuestions" along with a helpful "clarificationMessage".
           - If a destination is specified, set "requiresClarification" to false, and simulate executing your 7 internal tools to collect data and generate the full structured "report" object matching the schema.

        Return a beautiful, complete JSON object matching the requested schema. Provide realistic, hyper-detailed data without placeholder values. Ensure the day-wise itinerary is fully populated and fits the trek duration. The recommendation should be GO, GO WITH CAUTION, or DELAY.`;

        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                isGeneralQuestion: { type: Type.BOOLEAN },
                generalResponse: { type: Type.STRING },
                requiresClarification: { type: Type.BOOLEAN },
                clarificationQuestions: { type: Type.ARRAY, items: { type: Type.STRING } },
                clarificationMessage: { type: Type.STRING },
                steps: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      tool: { type: Type.STRING },
                      status: { type: Type.STRING },
                      message: { type: Type.STRING },
                      thought: { type: Type.STRING }
                    },
                    required: ["tool", "status", "message", "thought"]
                  }
                },
                report: {
                  type: Type.OBJECT,
                  properties: {
                    expeditionSummary: { type: Type.STRING },
                    trekDifficulty: { type: Type.STRING },
                    weatherAssessment: {
                      type: Type.OBJECT,
                      properties: {
                        temperature: { type: Type.STRING },
                        rain: { type: Type.STRING },
                        snow: { type: Type.STRING },
                        wind: { type: Type.STRING },
                        visibility: { type: Type.STRING },
                        suitability: { type: Type.STRING }
                      },
                      required: ["temperature", "rain", "snow", "wind", "visibility", "suitability"]
                    },
                    healthAssessment: {
                      type: Type.OBJECT,
                      properties: {
                        fitness: { type: Type.STRING },
                        asthmaAnalysis: { type: Type.STRING },
                        oxygenLevels: { type: Type.STRING },
                        heartRate: { type: Type.STRING },
                        altitudeSuitability: { type: Type.STRING },
                        riskLevel: { type: Type.STRING },
                        explanation: { type: Type.STRING }
                      },
                      required: ["fitness", "asthmaAnalysis", "oxygenLevels", "heartRate", "altitudeSuitability", "riskLevel", "explanation"]
                    },
                    altitudeStrategy: {
                      type: Type.OBJECT,
                      properties: {
                        maxAltitude: { type: Type.STRING },
                        dailyElevationGain: { type: Type.STRING },
                        acclimatizationSchedule: { type: Type.ARRAY, items: { type: Type.STRING } },
                        amsRisk: { type: Type.STRING },
                        precautions: { type: Type.ARRAY, items: { type: Type.STRING } }
                      },
                      required: ["maxAltitude", "dailyElevationGain", "acclimatizationSchedule", "amsRisk", "precautions"]
                    },
                    dayWiseItinerary: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          day: { type: Type.STRING },
                          title: { type: Type.STRING },
                          distance: { type: Type.STRING },
                          altitude: { type: Type.STRING },
                          description: { type: Type.STRING },
                          checkpoint: { type: Type.STRING },
                          campsite: { type: Type.STRING },
                          waterSource: { type: Type.STRING }
                        },
                        required: ["day", "title", "distance", "altitude", "description", "checkpoint", "campsite", "waterSource"]
                      }
                    },
                    packingChecklist: {
                      type: Type.OBJECT,
                      properties: {
                        requiredGear: { type: Type.ARRAY, items: { type: Type.STRING } },
                        missingItems: { type: Type.ARRAY, items: { type: Type.STRING } },
                        optionalItems: { type: Type.ARRAY, items: { type: Type.STRING } },
                        estimatedPackWeight: { type: Type.STRING }
                      },
                      required: ["requiredGear", "missingItems", "optionalItems", "estimatedPackWeight"]
                    },
                    budgetBreakdown: {
                      type: Type.OBJECT,
                      properties: {
                        transport: { type: Type.INTEGER },
                        accommodation: { type: Type.INTEGER },
                        food: { type: Type.INTEGER },
                        permits: { type: Type.INTEGER },
                        equipment: { type: Type.INTEGER },
                        emergencyReserve: { type: Type.INTEGER },
                        totalBudget: { type: Type.INTEGER },
                        currency: { type: Type.STRING },
                        status: { type: Type.STRING },
                        explanation: { type: Type.STRING }
                      },
                      required: ["transport", "accommodation", "food", "permits", "equipment", "emergencyReserve", "totalBudget", "currency", "status", "explanation"]
                    },
                    riskAnalysis: { type: Type.ARRAY, items: { type: Type.STRING } },
                    emergencyPlan: {
                      type: Type.OBJECT,
                      properties: {
                        nearbyHospitals: { type: Type.ARRAY, items: { type: Type.STRING } },
                        emergencyContacts: { type: Type.ARRAY, items: { type: Type.STRING } },
                        rescueProcedures: { type: Type.ARRAY, items: { type: Type.STRING } },
                        emergencyChecklist: { type: Type.ARRAY, items: { type: Type.STRING } }
                      },
                      required: ["nearbyHospitals", "emergencyContacts", "rescueProcedures", "emergencyChecklist"]
                    },
                    finalRecommendation: { type: Type.STRING },
                    confidenceScore: { type: Type.INTEGER },
                    reasoning: { type: Type.STRING }
                  },
                  required: [
                    "expeditionSummary",
                    "trekDifficulty",
                    "weatherAssessment",
                    "healthAssessment",
                    "altitudeStrategy",
                    "dayWiseItinerary",
                    "packingChecklist",
                    "budgetBreakdown",
                    "riskAnalysis",
                    "emergencyPlan",
                    "finalRecommendation",
                    "confidenceScore",
                    "reasoning"
                  ]
                }
              },
              required: ["requiresClarification", "steps"]
            }
          }
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
