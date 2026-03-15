const crypto = require("crypto");

// VULNERABLE: Using MD5 for password hashing
function hashPassword(password) {
  // CWE-327: MD5 is cryptographically broken
  return crypto.createHash("md5").update(password).digest("hex");
}

// SAFE: Using bcrypt (for comparison)
const bcrypt = require("bcrypt");

async function hashPasswordSafe(password) {
  return bcrypt.hash(password, 12);
}

module.exports = { hashPassword, hashPasswordSafe };
