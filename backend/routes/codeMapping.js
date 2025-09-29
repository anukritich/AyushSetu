const express = require("express");
const { spawn } = require("child_process");
const db = require("../db"); // your SQLite/Postgres connection

const router = express.Router();

// POST /api/code-mapping
router.post("/", (req, res) => {
  const { namaste_code } = req.body;

  if (!namaste_code) {
    return res
      .status(400)
      .json({ success: false, message: "NAMASTE code is required" });
  }

  // Lookup description in the database
  const query = "SELECT DESCRIPTION FROM namaste_terms WHERE NAMC_CODE = ?";
  db.get(query, [namaste_code], (err, row) => {
    if (err) {
      console.error("DB Error:", err);
      return res
        .status(500)
        .json({ success: false, message: "Database error" });
    }

    if (!row) {
      return res
        .status(404)
        .json({ success: false, message: "NAMASTE code not found" });
    }

    const description = row.Description;

    // Call Python ICD script
    const pyProcess = spawn("python", ["../src/api/icd_search.py", description]);

    let output = "";
    let errorOutput = "";

    pyProcess.stdout.on("data", (data) => {
      output += data.toString();
    });

    pyProcess.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });

    pyProcess.on("close", (code) => {
      if (code !== 0) {
        console.error("Python error:", errorOutput);
        return res.status(500).json({ success: false, error: errorOutput });
      }

      try {
        const parsed = JSON.parse(output); // Python JSON output

        // Map Python output to frontend format
        const icd_mappings = parsed.map((m) => ({
          equivalence: "equivalent", // default, can adjust later
          concept: {
            system: "ICD-11",
            code: m.icd_code || "unknown",
            display: m.title || "unknown",
          },
          source: m.uri || "",
          confidence: 1, // default confidence
        }));

        res.json({
          success: true,
          namaste_code,
          description,
          icd_mappings,
        });
      } catch (err) {
        console.error("JSON Parse Error:", err);
        res
          .status(500)
          .json({ success: false, error: "Failed to parse Python output" });
      }
    });
  });
});

module.exports = router;
