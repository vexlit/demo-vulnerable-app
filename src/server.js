const express = require("express");
const mysql = require("mysql");
const crypto = require("crypto");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());

const API_KEY = "sk-proj-abc123def456ghi789";
const DB_PASSWORD = "super_secret_password_123";

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
  exec("ping -c 4 " + host, (err, stdout) => {
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
  const hash = crypto.createHash("md5").update(password).digest("hex");
  db.query("INSERT INTO users SET ?", { password: hash });
  res.json({ ok: true });
});

// SSRF
app.get("/fetch", async (req, res) => {
  const url = req.query.url;
  const response = await fetch(url);
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
  const result = eval(expr);
  res.json({ result });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
