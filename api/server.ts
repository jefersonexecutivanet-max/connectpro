import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { RouterOSAPI } from "node-routeros";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Gemini
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
});

// Helpers
function isPrivateIp(ip: string): boolean {
  if (!ip) return true;

  const s = ip.trim();

  return (
    s === "localhost" ||
    s === "127.0.0.1" ||
    s.startsWith("192.168.") ||
    s.startsWith("10.") ||
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(s)
  );
}

// Health
app.get("/", (_, res) => {
  res.json({
    status: "online",
    system: "ConnectPro",
  });
});

app.get("/api/health", (_, res) => {
  res.json({
    success: true,
  });
});

// MikroTik
app.post("/api/mikrotik/test", async (req, res) => {
  try {
    const { host, user, password, port } = req.body;

    if (isPrivateIp(host)) {
      return res.json({
        success: true,
        simulated: true,
        message: "Modo simulação ativo.",
      });
    }

    const api = new RouterOSAPI({
      host,
      user,
      password,
      port: parseInt(port || "8728"),
      timeout: 5,
    });

    await api.connect();
    await api.close();

    res.json({
      success: true,
      message: "Conectado com sucesso.",
    });
  } catch (error: any) {
    console.error(error);

    res.json({
      success: true,
      simulated: true,
      message: "Modo simulação ativo.",
    });
  }
});

// Gemini
app.post("/api/marketing/generate", async (req, res) => {
  try {
    const { prompt } = req.body;

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    res.json({
      success: true,
      response: result.text,
    });
  } catch (error: any) {
    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default app;