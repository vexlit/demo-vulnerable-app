const express = require('express');
const mysql = require('mysql');
const app = express();
const db = mysql.createConnection({host: 'localhost', user: 'root', database: 'app'});

app.get('/user', (req, res) => {
  const id = req.query.id;
  const query = "SELECT * FROM users WHERE id = '" + id + "'";
  db.query(query, (err, results) => res.json(results));
});

app.get('/exec', (req, res) => {
  const cmd = req.query.cmd;
  require('child_process').exec(cmd, (err, stdout) => res.send(stdout));
});

app.get('/file', (req, res) => {
  const path = req.query.path;
  const fs = require('fs');
  res.send(fs.readFileSync(path, 'utf-8'));
});

app.listen(3000);
