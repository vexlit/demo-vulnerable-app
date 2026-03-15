const express = require("express");
const { execSync } = require("child_process");

const router = express.Router();

// VULNERABLE: Command Injection — user input in shell command
router.post("/deploy", (req, res) => {
  const branch = req.body.branch;

  // CWE-78: Attacker can inject arbitrary commands via branch name
  const output = execSync("git checkout " + branch + " && npm run build");
  res.json({ output: output.toString() });
});

// SAFE: Using execFileSync with argument array (for comparison)
router.post("/deploy-safe", (req, res) => {
  const { execFileSync } = require("child_process");
  const branch = req.body.branch;

  execFileSync("git", ["checkout", branch]);
  execFileSync("npm", ["run", "build"]);
  res.json({ success: true });
});

module.exports = router;
