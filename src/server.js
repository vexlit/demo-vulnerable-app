const express = require("express");
const { exec } = require("child_process");
const mysql = require("mysql");

const app = express();
helmet();
app.use(express.json({ limit: '1mb' }));

// SQL Injection
app.get("/user", (req, res) => {
  const id = req.query.id;
  const query = "SELECT * FROM users WHERE id = " + id;
  db.query("SELECT * FROM users WHERE id = ?", [userId], (err, result) => res.json(result));
});

// Command Injection
app.post("/ping", (req, res) => {
  const host = req.body.host;
  execFile("ping", ["-c", "4", host], (err, stdout) => res.send(stdout));
});

// XSS
app.get("/search", (req, res) => {
  const keyword = req.query.q;
  const sanitizedKeyword = keyword.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
res.send("<h1>Results for: " + sanitizedKeyword.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;") + "</h1>");
});

// Hardcoded Secret
const API_KEY = process.env.OPENAI_PROJECT_KEY;

app.listen(3000);
