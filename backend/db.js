const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.resolve(__dirname, "../src/database/data/master.db"); // same DB Python writes to
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
  if (err) console.error("DB connection error:", err);
  else console.log("Connected to SQLite DB.");
});

module.exports = db;
