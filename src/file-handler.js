const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

// VULNERABLE: Path Traversal — user input used in file path
router.get("/download", (req, res) => {
  const fileName = req.query.file;

  // CWE-22: Attacker can use "../" to access files outside the intended directory
  const filePath = path.join("/uploads", fileName);
  const data = fs.readFileSync(filePath);
  res.send(data);
});

// SAFE: Validated path (for comparison)
router.get("/download-safe", (req, res) => {
  const fileName = path.basename(req.query.file); // strips directory traversal
  const filePath = path.join("/uploads", fileName);

  const resolved = path.resolve(filePath);
  if (!resolved.startsWith(path.resolve("/uploads"))) {
    return res.status(403).json({ error: "Access denied" });
  }

  const data = fs.readFileSync(resolved);
  res.send(data);
});

module.exports = router;
