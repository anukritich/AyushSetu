const express = require("express");
const { spawn } = require("child_process");

const router = express.Router();
// temporary store
const namasteICDStore = {};


router.post("/map-to-icd", async (req, res) => {
  const { namaste_code, description } = req.body;

  if (!description) {
    return res.status(400).json({ success: false, message: "Description is required" });
  }

  try {
    // Pass description safely to Python
    const py = spawn("python", ["../src/api/icd_search.py", description]);

    let resultData = "";
    let errorData = "";

    py.stdout.on("data", (data) => {
      resultData += data.toString();
    });

    py.stderr.on("data", (data) => {
      errorData += data.toString();
    });

    process.on("close", (code) => {
        if (code !== 0) {
            return res.status(500).json({ success: false, error: errorOutput });
        }

        try {
            const parsed = JSON.parse(output);  // <-- parse JSON from Python
            res.json({ success: true, data: parsed[0] || null }); // send first result
        } catch (err) {
            res.status(500).json({ success: false, error: "Failed to parse Python output" });
        }
        });

  } catch (err) {
    console.error("Error running ICD script:", err);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

module.exports = router;  