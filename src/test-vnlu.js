// vulnerable-test.js
const express = require("express");
const { execSync } = require("child_process");
const mysql = require("mysql");

const app = express();
app.use(express.json());

// Command Injection (CWE-78)
app.get("/ping", (req, res) => {
  const host = req.query.host;
  const result = execSync(`ping -c 3 ${host}`);
  res.send(result.toString());
});

// SQL Injection (CWE-89)
app.get("/user", (req, res) => {
  const id = req.query.id;
  const conn = mysql.createConnection({ host: "localhost", user: "root", database: "app" });
  conn.query("SELECT * FROM users WHERE id = " + id, (err, rows) => {
    res.json(rows);
  });
});

// Path Traversal (CWE-22)
const fs = require("fs");
app.get("/file", (req, res) => {
  const name = req.query.name;
  const content = fs.readFileSync("/uploads/" + name, "utf-8");
  res.send(content);
});

// XSS (CWE-79)
app.get("/search", (req, res) => {
  const q = req.query.q;
  res.send(`<html><body>Results for: ${q}</body></html>`);
});

// Hardcoded Secret
const API_KEY = "sk_live_abcdef1234567890";

app.listen(3000);
