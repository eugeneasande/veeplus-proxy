import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Replace with your actual deployed Google Apps Script URL:
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycby7MAE-V1Gs2n6e3OR5j655EjgkoXTT4cdKB09T7H-ZQas1rdee4EhQTvpBQ3lsmtDTZA/exec";

app.use(express.json());

// ✅ CORS middleware for GitHub Pages/frontend use
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

// ✅ Submit route — forwards receipt data to Google Apps Script
app.post("/submit", async (req, res) => {
  try {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body)
    });

    const text = await response.text();
    console.log("📦 Google Script Response:", text);

    try {
      const result = JSON.parse(text);
      res.json(result);
    } catch {
      console.error("❌ Google Script returned invalid JSON:", text);
      res.status(500).json({
        error: "Google Script did not return valid JSON",
        raw: text
      });
    }
  } catch (err) {
    console.error("❌ Proxy fetch error:", err);
    res.status(500).json({ error: "Proxy failed to reach Google Script" });
  }
});

// ✅ Get last receipt number
app.get("/get-last", async (req, res) => {
  try {
    const response = await fetch(GOOGLE_SCRIPT_URL);
    const text = await response.text();
    console.log("📤 Last receipt response:", text);

    try {
      const data = JSON.parse(text);
      res.json(data);
    } catch {
      res.status(500).json({
        error: "Google Script returned invalid JSON",
        raw: text
      });
    }
  } catch (err) {
    console.error("❌ Failed to fetch last receipt:", err);
    res.status(500).json({ error: "Error fetching last receipt" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ VEE-PLUS proxy running at http://localhost:${PORT}`);
});
