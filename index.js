import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycby7MAE-V1Gs2n6e3OR5j655EjgkoXTT4cdKB09T7H-ZQas1rdee4EhQTvpBQ3lsmtDTZA/exec"; // Replace with your Google Apps Script URL

app.use(express.json());

// CORS middleware
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.sendStatus(200); // Handle preflight request
  next();
});

// Proxy route
app.post("/submit", async (req, res) => {
  try {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: req.body })
    });

    const result = await response.json();
    res.json(result);
  } catch (err) {
    console.error("Proxy error:", err);
    res.status(500).json({ error: "Failed to send to Google Sheets" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Proxy running at http://localhost:${PORT}`);
});
