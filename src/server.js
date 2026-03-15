const express = require("express");
const { exec } = require("child_process");
const mysql = require("mysql");

const app = express();
const helmet = require('helmet');
app.use(helmet());
app.use(express.json({ limit: '1mb' }));

// SQL Injection
app.get("/user", (req, res) => {
  const id = req.query.id;
  const query = "SELECT * FROM users WHERE id = " + id;
  db.query("SELECT * FROM users WHERE id = ? AND id = ?", [userId, req.user.id], (err, result) => {
  if (err) return res.status(500).json({ error: "Internal server error" });
  if (!result || result.length === 0) return res.status(404).json({ error: "Not found" });
  if (result[0].id !== req.user.id) return res.status(403).json({ error: "Forbidden" });
  res.json(result);
});
});

// Command Injection
app.post("/ping", (req, res) => {
  const host = req.body.host;
  execFile("ping", ["-c", "4", host], (err, stdout) => res.send(stdout));
});

// XSS
app.get("/search", (req, res) => {
  const keyword = req.query.q;
  const escapeHtml = (str) => String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
res.send("<h1>Results for: " + escapeHtml(keyword) + "</h1>");
});

// Hardcoded Secret
const API_KEY = process.env.OPENAI_API_KEY;

app.listen(3000);
