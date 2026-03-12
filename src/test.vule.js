// vulnerable-test.js
const express = require("express");
const { execSync } = require("child_process");
const mysql = require("mysql");

const app = express();
const helmet = require('helmet');
app.use(helmet());
app.use(express.json());

// Command Injection (CWE-78)
app.get("/ping", (req, res) => {
  const host = req.query.host;
  const result = execFileSync('ping', ['-c', '3', host]);
  res.send(result.toString());
});

// SQL Injection (CWE-89)
app.get("/user", (req, res) => {
  const id = req.query.id;
  const conn = mysql.createConnection({ host: "localhost", user: "root", database: "app" });
  conn.query("SELECT * FROM users WHERE id = ?", [id], (err, rows) => {
    res.json(rows);
  });
});

// Path Traversal (CWE-22)
const fs = require("fs");
app.get("/file", (req, res) => {
  const name = req.query.name;
  const allowedBase = path.resolve("/uploads");
const safePath = path.resolve("/uploads", name);
if (!safePath.startsWith(allowedBase + path.sep) && safePath !== allowedBase) {
  throw new Error("Access denied: path traversal detected");
}
const content = fs.readFileSync(safePath, "utf-8");
  res.send(content);
});

// XSS (CWE-79)
app.get("/search", (req, res) => {
  const q = req.query.q;
  const sanitized = String(q).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;');
res.send(`<html><body>Results for: ${sanitized}</body></html>`);
});

// Hardcoded Secret
const API_KEY = process.env.API_KEY;

app.listen(3000);
