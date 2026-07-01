export async function getTrekRecommendation(userProfile: any) {
  try {
    const response = await fetch("/api/gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "recommendation", payload: userProfile })
    });
    if (!response.ok) throw new Error("Server responded with error");
    return await response.json();
  } catch (error) {
    console.error("Gemini Proxy Error:", error);
    return [];
  }
}

export async function getSafetyAnalysis(trekName: string, weather: any) {
  try {
    const response = await fetch("/api/gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "safety", payload: { trekName, weather } })
    });
    if (!response.ok) throw new Error("Server responded with error");
    return await response.json();
  } catch (error) {
    console.error("Gemini Proxy Error:", error);
    return { 
      status: "warning", 
      recommendation: "DELAY", 
      decisionBrief: "Unable to sync with orbital weather sensors. Exercise extreme manual caution.", 
      precautions: ["Check local station updates", "Verify backup communications", "Monitor sky condition", "Carry emergency bivouac"] 
    };
  }
}
