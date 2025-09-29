const express = require("express");
const cors = require("cors");
const { spawn } = require("child_process");
const searchRouter = require("./routes/search");

const app = express();
const port = 5000;

// Middleware
app.use(cors());            // allow frontend requests
app.use(express.json());    // parse JSON request bodies

// Existing search route (from routes/search.js)
app.use("/api/search", searchRouter);

// Test route
app.get("/api/search/test", (req, res) => {
  res.json({ message: "Search route working!" });
});

// 🚀 New POST route
app.post("/api/map-to-icd", (req, res) => {
  const { namaste_code, description } = req.body;

  if (!description) {
    return res
      .status(400)
      .json({ success: false, message: "Description is required" });
  }

  // Call your Python script
  const process = spawn("python", ["../src/api/icd_search.py", description]);

  let output = "";
  let errorOutput = "";

  process.stdout.on("data", (data) => {
    output += data.toString();
  });

  process.stderr.on("data", (data) => {
    errorOutput += data.toString();
  });

  process.on("close", (code) => {
    if (code !== 0) {
      return res.status(500).json({ success: false, error: errorOutput });
    }
    res.json({ success: true, data: output.trim() });
  });
});

// Start server
app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
