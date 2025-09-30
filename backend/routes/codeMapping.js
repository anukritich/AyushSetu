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
  // Note: Ensure the column name 'DESCRIPTION' matches your DB schema case-sensitively.
  const query = "SELECT DESCRIPTION FROM namaste_terms WHERE NAMC_CODE = ?";
  db.get(query, [namaste_code], (err, row) => {
    if (err) {
      console.error("DB Error:", err);
      return res
        .status(500)
        .json({ success: false, message: "Database error" });
    }

    // Check if row exists and description is available
    if (!row || !row.DESCRIPTION) {
      return res
        .status(404)
        .json({ success: false, message: `NAMASTE code ${namaste_code} found, but description is missing.` });
    }

    const description = row.DESCRIPTION;

    // Call Python ICD script
    // Note: Assuming '../src/api/icd_search.py' is the correct path relative to where this Node process runs.
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
        // Return descriptive error from Python script
        return res.status(500).json({ success: false, error: errorOutput.trim() || "Python script execution failed" });
      }

      try {
        const parsed = JSON.parse(output); // Python JSON output (expected to be an array)

        if (!Array.isArray(parsed)) {
            console.error("Python output is not an array:", parsed);
            return res.status(500).json({ success: false, error: "Invalid format from Python script" });
        }
        
        // Map Python output to the structured frontend format
        const icd_mappings = parsed.map((m) => ({
          // Use value from Python output, default to 'equivalent' if missing
          equivalence: m.equivalence || "equivalent",
          concept: {
            // Use specific system URI from Python output, default to a standard ICD-11 reference
            system: m.system || "http://id.who.int/icd/release/11/2024-01/mms",
            code: m.icd_code || "unknown",
            display: m.title || "unknown",
          },
          source: m.uri || "", // Use URI as the mapping source
          // Use confidence from Python output (expected to be 0 to 1), default to 1
          confidence: m.confidence != null ? parseFloat(m.confidence) : 1, 
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
