import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

// Initialize Gemini API Client server-side
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "AIzaSyCLKX2tohQTHF9Gk06XqqlT-tXUjVSOYBU",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parsers
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API Route - Server Health Check
  app.get("/api/health", (req, res) => {
    res.json({ status: "healthy", timestamp: new Date().toISOString() });
  });

  // API Route - Log and process contact / quote request
  app.post("/api/quote", (req, res) => {
    const { name, email, phone, company, serviceType, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "Missing required fields (name, email, message)." });
    }

    // Generate a stylized, professional Reference Number / Lead ID
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const leadReference = `STG-${randomNum}`;

    console.log(`[Quote-Trial Request Opened] Reference: ${leadReference}`);
    console.log(`Name: ${name} (${company || "Individual Owner Operator"})`);
    console.log(`Email: ${email} | Phone: ${phone || "N/A"}`);
    console.log(`Requested Support / Class: ${serviceType || "SaaS Demo & GPS Inquiry"}`);
    console.log(`Message: ${message}`);

    return res.status(200).json({
      success: true,
      message: "Trial and quote request submitted successfully! Our routing team will reach out with account details in under 15 minutes.",
      reference: leadReference,
    });
  });

  // API Route - Interactive Support Chatbot proxying the Gemini SDK
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history } = req.body;

      if (!message) {
        return res.status(400).json({ error: "Message is required." });
      }

      // Convert history format to Google GenAI structure if present
      const formattedContents: any[] = [];

      if (history && Array.isArray(history)) {
        history.forEach((h: any) => {
          formattedContents.push({
            role: h.role === "user" ? "user" : "model",
            parts: [{ text: h.text }]
          });
        });
      }

      // Append current message
      formattedContents.push({
        role: "user",
        parts: [{ text: message }]
      });

      const systemInstruction = `You are 'Superiorbot', the premium automated logistics assistant representing **Superior Truck GPS**, an advanced commercial truck app and platform providing truck-safe routing, ELD compliance, quick automated IFTA tracking, and a broker-free load board—all for just $10/month per active vehicle with absolute zero contracts.

Corporate Information:
- **Company Name:** Superior Truck GPS
- **Pricing:** Only $10/mo per active truck, no commitments, cancel anytime. Comes with a 14-Day Free Trial! No credit card required to start.
- **Support Phone:** (973) 932-4796
- **Support Email:** support@superiortruckgps.org
- **Primary Offerings & Features:**
  1. **Truck-Safe Navigation & GPS:** Commercial voice-guided routing customized to Class 1-8 cab sizes, weight limits, propane/hazard HAZMAT parameters to strictly avoid low bridges and forbidden routes.
  2. **ELD Compliance (HOS Logs):** FMCSA-registered electronic logs connecting via wireless Bluetooth, electronic log audits, inspection state file output, logs compliance.
  3. **Broker-Free Load Board:** Connect direct to shipping loads, 100% rate transparency, 0% commission fees (skip broker fee structures).
  4. **IFTA Tax Tracker:** Automatic distance calculation by state cross-borders and receipts scanning to output audited worksheets in seconds.
  5. **Live Dispatch Fleet Hub:** Live truck mapping coordinates, load dispatching, active ETA, dispatcher panels for multi-vehicle fleet operators.

Guidelines:
- Provide friendly, commercial logistics-oriented, helpful, and highly clear responses. Avoid dry and salesy corporate nonsense. Speak with active trucker companion terms.
- Actively guide users to fill out the 14-Day Free Trial / Custom Quote Form on the website, or tell them they can get on the express dispatch setup line at (973) 932-4796 or support@superiortruckgps.org directly for immediate onboarding support!
- Do not manufacture any false rates or other system credentials. Maintain professional, reliable, and premium clarity of the product.`;

      // Call the Gemini-3.5-flash model
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: formattedContents,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      const replyText = response.text || "I am here to help you get onboarded with Superior Truck GPS. Please let me know how I can assist or contact our technical support line at (973) 932-4796.";

      return res.json({ text: replyText });
    } catch (error: any) {
      console.error("Gemini API Error details:", error);
      return res.status(500).json({
        error: "I encountered a minor network routing latency. Please feel free to submit the 14-Day Free Trial form or telephone our support desk directly at (973) 932-4796 anytime!",
        details: error?.message || error
      });
    }
  });

  // Vite Integration in Development / Static Serving in Production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("[Dev Mode] Mounted Vite developer middleware.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("[Production Mode] Serving compiled static assets from dist/.");
  }

  // PORT must be 3000 as mandated by Cloud Run reverse proxy layers
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Superior Delivery Systems LLC App is running on port ${PORT}`);
  });
}

startServer().catch(err => {
  console.error("Fatal Server Startup Error:", err);
});
