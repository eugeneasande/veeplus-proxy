import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Replace with your actual Google Apps Script Web App URL:
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycby7MAE-V1Gs2n6e3OR5j655EjgkoXTT4cdKB09T7H-ZQas1rdee4EhQTvpBQ3lsmtDTZA/exec";

app.use(express.json());

// ✅ CORS middleware
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

// ✅ Submit route — sends to Google Script
app.post("/submit", async (req, res) => {
  try {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body) // ✅ fixed right here
    });

    const result = await response.json();
    res.json(result);
  } catch (err) {
    console.error("❌ Proxy error:", err);
    res.status(500).json({ error: "Failed to send to Google Sheets" });
  }
});

// ✅ Optional: Add /get-last if you're fetching last receipt number
app.get("/get-last", async (req, res) => {
  try {
    const response = await fetch(GOOGLE_SCRIPT_URL);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("❌ Failed to fetch last receipt:", err);
    res.status(500).json({ error: "Failed to fetch last receipt" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ VEE-PLUS proxy running on http://localhost:${PORT}`);
});
