import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ REPLACE THIS with your Google Apps Script Web App URL:
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycby7MAE-V1Gs2n6e3OR5j655EjgkoXTT4cdKB09T7H-ZQas1rdee4EhQTvpBQ3lsmtDTZA/exec";

app.use(express.json());

// ✅ Allow CORS from your frontend (GitHub Pages, etc.)
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

// ✅ Submit data to Google Sheet
app.post("/submit", async (req, res) => {
  try {
    const data = req.body;

    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    res.json(result);
  } catch (err) {
    console.error("❌ Proxy error:", err);
    res.status(500).json({ error: "Failed to send to Google Sheets" });
  }
});

// ✅ Fetch last receipt number from Google Sheet
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
