import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

export async function generateMarketingContent(prompt: string, providerName: string) {
  try {
    const result = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Você é um estrategista sênior de marketing para provedores de internet fibra óptica (ISP).
      Sua missão é criar uma campanha persuasiva para o provedor "${providerName}" baseada no pedido: "${prompt}".
      Foque em benefícios técnicos como: baixa latência para games, estabilidade para home office e velocidade real.
      Retorne um JSON estritamente com os campos:
      - title: Título matador e curto (ex: "Upgrade Gamer", "Verão Fibra")
      - message: Texto para WhatsApp/Redes Sociais usando gatilhos mentais e emojis.
      - bannerPrompt: Um prompt em inglês detalhado para Midjourney/DALL-E criar um banner moderno e tech.
      - strategy: Uma breve explicação do porquê essa abordagem funciona para ISPs.`,
      config: {
        responseMimeType: "application/json",
      }
    });

    const rawText = result.text || "{}";
    try {
      return JSON.parse(rawText);
    } catch (_) {
      return { raw: rawText };
    }
  } catch (error: any) {
    console.error("AI Error:", error);
    throw new Error(error.message);
  }
}

export async function askGemini(prompt: string) {
  try {
    const result = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    return result.text || "";
  } catch (error: any) {
    console.error("AI Error:", error);
    throw new Error(error.message);
  }
}
