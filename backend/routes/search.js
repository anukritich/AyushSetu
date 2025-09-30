const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", (req, res) => {
  const { q } = req.query;
  db.all(
    "SELECT * FROM namaste_terms WHERE NAMC_term LIKE ? LIMIT 50",
    [`%${q}%`],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

module.exports = router;
