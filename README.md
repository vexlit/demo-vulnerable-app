# Vexlit Demo — Vulnerable Application

> This repo contains **intentionally vulnerable code** to demonstrate [Vexlit](https://vexlit.com) security scanning.

## What is Vexlit?

Vexlit is an AI-powered security scanner that finds vulnerabilities and **automatically fixes them**.

- **SAST** — 34 languages, 478+ rules
- **SCA** — npm, yarn, pnpm dependency scanning
- **AI Fix** — Automated code fixes, verified by the scan engine
- **PR Review** — GitHub Check Run + inline comments + AI fix suggestions

## Vulnerabilities included

| File | Vulnerability | CWE |
|------|--------------|-----|
| `src/auth.js` | SQL Injection | CWE-89 |
| `src/file-handler.js` | Path Traversal | CWE-22 |
| `src/admin.js` | Command Injection | CWE-78 |
| `src/crypto.js` | Weak Cryptography | CWE-327 |
| `src/api.py` | SQL Injection (Python) | CWE-89 |
| `src/UserService.java` | SQL Injection (Java) | CWE-89 |
| `.env.example` | Hardcoded Secret | CWE-798 |

Each file includes both a **vulnerable** and **safe** version for comparison.

## Try it locally

```bash
git clone https://github.com/vexlit/demo-vulnerable-app
cd demo-vulnerable-app
npx @vexlit/cli scan .
```

## GitHub Action

This repo includes a GitHub Action that automatically scans on every push and PR:

```yaml
name: Vexlit Security Scan
on: [push, pull_request]
jobs:
  scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: vexlit/action@v1
```

**Open a Pull Request** to see Vexlit in action:
- Check Run annotations on vulnerable lines
- PR comment with severity summary
- Inline review comments with fix suggestions
- AI Fix available on the dashboard

## VSCode Extension

Install [Vexlit for VS Code](https://marketplace.visualstudio.com/items?itemName=vexlit.vexlit) for real-time diagnostics, quick fixes, and AI-powered code repair.

## License

MIT
