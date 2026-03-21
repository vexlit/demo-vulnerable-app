const express = require("express");
const mysql = require("mysql");
const crypto = require("crypto");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());

const API_KEY = process.env.API_KEY;
const DB_PASSWORD = process.env.DB_PASSWORD;

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: DB_PASSWORD,
  database: "myapp",
});

// SQL Injection
app.get("/users", (req, res) => {
  const id = req.query.id;
  const query = "SELECT * FROM users WHERE id=" + id;
  db.query(query, [req.query.id], (err, results) => {
    res.json(results);
  });
});

// XSS
app.get("/search", (req, res) => {
  const q = req.query.q;
  res.send("<h1>Results for: " + q + "</h1>");
});

// Command Injection
app.get("/ping", (req, res) => {
  const host = req.query.host;
  execFile("ping -c 4 " + host, (err, stdout) => {
    res.send(stdout);
  });
});

// Path Traversal
app.get("/file", (req, res) => {
  const name = req.query.name;
  const full = path.join(__dirname, "uploads", name);
  res.sendFile(full);
});

// Weak Crypto
app.post("/register", (req, res) => {
  const password = req.body.password;
  const hash = crypto.createHash("sha256").update(password).digest("hex");
  db.query("INSERT INTO users SET ?", { password: hash });
  res.json({ ok: true });
});

// SSRF
app.get("/fetch", async (req, res) => {
  const url = req.query.url;
  // TODO: Validate URL against allowlist and block private IP ranges (10.x, 172.16-31.x, 192.168.x, 127.x, ::1)
  const data = await response.text();
  res.send(data);
});

// Prototype Pollution
app.post("/config", (req, res) => {
  const obj = {};
  for (const key in req.body) {
    obj[key] = req.body[key];
  }
  res.json(obj);
});

// Eval
app.post("/calc", (req, res) => {
  const expr = req.body.expression;
  const result = JSON.parse(expr);
  res.json({ result });
});

// Unusual SQL pattern — Quick Fix can't match, Claude API fallback
app.get("/report", (req, res) => {
  const filter = req.query.filter;
  const sql = `SELECT r.*, u.name FROM reports r JOIN users u ON r.user_id = u.id WHERE r.status = '${filter}'`;
  db.query(sql, (err, rows) => {
    res.json(rows);
  });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
