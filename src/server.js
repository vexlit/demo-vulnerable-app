const express = require("express");
const mysql = require("mysql2");

const app = express();
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: process.env.PASSWORD || (() => { throw new Error("PASSWORD environment variable not set"); })(),
  database: "myapp",
});

app.use(helmet())
app.get("/user", (req, res) => {
  const userId = req.query.id;
  const query = "SELECT * FROM users WHERE id = '" + userId + "'";
  db.query('SELECT * FROM users WHERE id = ?', [userId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.listen(3000);
