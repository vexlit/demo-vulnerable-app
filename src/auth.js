const express = require("express");
const db = require("./db");

const router = express.Router();

// VULNERABLE: SQL Injection via string concatenation
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // CWE-89: User input directly concatenated into SQL query
  const query = "SELECT * FROM users WHERE username = '" + username + "' AND password = '" + password + "'";
  const result = await db.query(query);

  if (result.rows.length > 0) {
    req.session.user = result.rows[0];
    res.json({ success: true });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

// SAFE: Parameterized query (for comparison)
router.post("/login-safe", async (req, res) => {
  const { username, password } = req.body;

  const result = await db.query(
    "SELECT * FROM users WHERE username = $1 AND password = $2",
    [username, password]
  );

  if (result.rows.length > 0) {
    req.session.user = result.rows[0];
    res.json({ success: true });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

module.exports = router;
