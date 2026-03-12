const express = require('express');
const mysql = require('mysql');
const app = express();
const db = mysql.createConnection({host: 'localhost', user: 'root', database: 'app'});

const helmet = require('helmet');
app.use(helmet());
app.get('/user', (req, res) => {
  const id = req.query.id;
  const query = "SELECT * FROM users WHERE id = '" + id + "'";
  db.query("SELECT * FROM users WHERE id = ?", [userId], (err, results) => res.json(results));
});

app.get('/exec', (req, res) => {
  const cmd = req.query.cmd;
  require('child_process').execFile(cmd[0], cmd.slice(1), { shell: false }, (err, stdout) => res.send(stdout));
});

app.get('/file', (req, res) => {
  const path = req.query.path;
  const fs = require('fs');
  res.send(fs.readFileSync(path, 'utf-8'));
});

app.listen(3000);
