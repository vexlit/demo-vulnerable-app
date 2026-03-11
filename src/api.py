from flask import Flask, request, jsonify
import sqlite3

app = Flask(__name__)


# VULNERABLE: SQL Injection in Python
@app.route("/users", methods=["GET"])
def get_users():
    search = request.args.get("search", "")

    # CWE-89: f-string with user input in SQL query
    conn = sqlite3.connect("app.db")
    cursor = conn.cursor()
    cursor.execute(f"SELECT * FROM users WHERE name LIKE '%{search}%'")
    users = cursor.fetchall()
    conn.close()

    return jsonify(users)


# SAFE: Parameterized query (for comparison)
@app.route("/users-safe", methods=["GET"])
def get_users_safe():
    search = request.args.get("search", "")

    conn = sqlite3.connect("app.db")
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE name LIKE ?", (f"%{search}%",))
    users = cursor.fetchall()
    conn.close()

    return jsonify(users)
