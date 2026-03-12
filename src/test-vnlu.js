// vulnerable-test.js
const express = require("express");
const { execSync } = require("child_process");
const mysql = require("mysql");

const app = express();
const helmet = require('helmet');
app.use(helmet());
app.use(express.json({ limit: '1mb' }));

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
  const baseDir = path.resolve("/uploads");
const resolvedPath = path.resolve(baseDir, name);
if (!resolvedPath.startsWith(baseDir + path.sep) && resolvedPath !== baseDir) {
  throw new Error("Access denied: path traversal detected");
}
const content = fs.readFileSync(resolvedPath, "utf-8");
  res.send(content);
});

// XSS (CWE-79)
app.get("/search", (req, res) => {
  const q = req.query.q;
  const escapeHtml = (str) => String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;');
res.send(`<html><body>Results for: ${escapeHtml(q)}</body></html>`);
});

// Hardcoded Secret
const API_KEY = process.env.API_KEY;

app.listen(3000);
