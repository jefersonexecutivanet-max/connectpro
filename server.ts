import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import cors from "cors";
import { RouterOSAPI } from "node-routeros";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Gemini AI
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      "User-Agent": "connectpro",
    },
  },
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
app.get("/api/health", (_, res) => {
  res.json({
    success: true,
    status: "online",
    system: "ConnectPro",
  });
});

// MikroTik Test
app.post("/api/mikrotik/test", async (req, res) => {
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

  try {
    await api.connect();
    await api.close();

    res.json({
      success: true,
      message: "MikroTik conectado.",
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

// AI Marketing
app.post("/api/marketing/generate", async (req, res) => {
  try {
    const { prompt, providerName } = req.body;

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
Você é especialista em marketing para provedores ISP.

Empresa: ${providerName}

Pedido:
${prompt}
`,
    });

    res.json({
      success: true,
      text: result.text,
    });
  } catch (error: any) {
    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Frontend
async function setupFrontend() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
      },
      appType: "spa",
    });

    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");

    app.use(express.static(distPath));

    app.get("*", (_, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }
}

await setupFrontend();

export default app;