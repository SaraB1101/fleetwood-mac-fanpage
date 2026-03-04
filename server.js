const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const app = express();

app.use(express.static("public"));

const db = new sqlite3.Database(
  path.join(__dirname, "database", "database.db"),
  err => {
    if (err) {
      console.error("Database connection failed:", err.message);
    } else {
      console.log("Connected to SQLite database");
    }
  }
);

app.get("/api/test", (req, res) => {
  res.json({ message: "Server is working 🎸" });
});

app.get("/api/albums", (req, res) => {
  db.all("SELECT * FROM albums ORDER BY year ASC", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});


app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
