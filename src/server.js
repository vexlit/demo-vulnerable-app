const express = require("express");
const { exec } = require("child_process");
const mysql = require("mysql");

const app = express();
app.use(express.json());

// SQL Injection
app.get("/user", (req, res) => {
  const id = req.query.id;
  const query = "SELECT * FROM users WHERE id = " + id;
  db.query(query, (err, result) => res.json(result));
});

// Command Injection
app.post("/ping", (req, res) => {
  const host = req.body.host;
  exec("ping -c 4 " + host, (err, stdout) => res.send(stdout));
});

// XSS
app.get("/search", (req, res) => {
  const keyword = req.query.q;
  res.send("<h1>Results for: " + keyword + "</h1>");
});

// Hardcoded Secret
const API_KEY = "sk-proj-abc123def456ghi789jkl012mno345pqr678stu901vwx";

app.listen(3000);
