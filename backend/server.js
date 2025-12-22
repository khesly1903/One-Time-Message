import dotenv from "dotenv";
import express from "express";
import mysql from "mysql2/promise";
import cors from "cors";
import { randomUUID } from "crypto";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 3001);

const allowedOrigins = (process.env.CORS_ORIGIN ?? "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      // allow non-browser clients (no origin)
      if (!origin) return cb(null, true);
      // if no allowlist provided, allow all (dev convenience)
      if (allowedOrigins.length === 0) return cb(null, true);
      return cb(null, allowedOrigins.includes(origin));
    },
    methods: ["GET", "POST", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);
app.use(express.json());

// db connection
// const pool = mysql.createPool({
//   host: process.env.DB_HOST || "localhost",
//   user: process.env.DB_USER || "root",
//   password: process.env.DB_PASSWORD || "root",
//   database: process.env.DB_NAME || "otm_db",
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,
// });



const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});

const initDB = async () => {
  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS messages (
        id VARCHAR(36) PRIMARY KEY,
        encrypted_text LONGTEXT NOT NULL,
        expires_at DATETIME NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await pool.query(createTableQuery);

    // In case the table existed before without expires_at
    try {
      await pool.query("ALTER TABLE messages ADD COLUMN expires_at DATETIME NULL");
    } catch {
      // ignore if already exists
    }

    console.log("✅ Database Table is ready!");
  } catch (err) {
    console.error("❌ Database Error:", err);
  }
};

initDB();

// save message
app.post("/", async (req, res) => {
  try {
    const { encryptedData, expiresAt } = req.body;

    if (!encryptedData || typeof encryptedData !== "string") {
      return res.status(400).json({ error: "encryptedData is required" });
    }

    const id = randomUUID();
    let finalExpiresAt = null;

    if (expiresAt != null) {
      const d = new Date(expiresAt);
      if (Number.isNaN(d.getTime())) {
        return res.status(400).json({ error: "expiresAt must be a valid date" });
      }
      // MySQL DATETIME: YYYY-MM-DD HH:mm:ss
      finalExpiresAt = d.toISOString().slice(0, 19).replace("T", " ");
    }

    const sql =
      "INSERT INTO messages (id, encrypted_text, expires_at) VALUES (?, ?, ?)";
    await pool.query(sql, [id, encryptedData, finalExpiresAt]);

    res.status(201).json({ id });
  } catch (error) {
    console.error("Save Error:", error);
    res.status(500).json({ error: "Database error" });
  }
});

// read message
app.get("/:id", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT encrypted_text, expires_at, created_at FROM messages WHERE id = ?",
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Message not found or destroyed." });
    }

    const row = rows[0];
    const expiresAt = row.expires_at;

    if (expiresAt) {
      const exp = new Date(expiresAt);
      if (!Number.isNaN(exp.getTime()) && exp.getTime() <= Date.now()) {
        await pool.query("DELETE FROM messages WHERE id = ?", [req.params.id]);
        return res.status(410).json({ error: "Message expired." });
      }
    }

    // Return data WITHOUT deleting it yet (frontend decides burn-after-valid-read)
    res.json({
      encryptedData: row.encrypted_text,
      expiresAt: row.expires_at,
      createdAt: row.created_at,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// burn message after read
app.delete("/:id", async (req, res) => {
  console.log("activated");
  try {
    const [result] = await pool.query("DELETE FROM messages WHERE id = ?", [
      req.params.id,
    ]);

    if (result.affectedRows > 0) {
      res.json({ ok: true });
    } else {
      res.status(404).json({ error: "Message already gone." });
    }
  } catch (error) {
    res.status(500).json({ error: "Delete error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
