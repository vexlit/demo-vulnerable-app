const express = require("express");
const mysql = require("mysql");
const app = express();

app.get("/user", (req, res) => {
  const id = req.query.id;
  const query = "SELECT * FROM users WHERE id = '" + id + "'";
  const conn = mysql.createConnection({ host: "localhost", user: "root", database: "app" });
  conn.query(query, (err, results) => {
    res.json(results);
  });
});
