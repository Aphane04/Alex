const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcrypt");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public")); // serves your HTML pages

// ================================
// DATABASE CONNECTION
// ================================
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Alex2391#", // change this
    database: "secureride"
});

db.connect(err => {
    if (err) {
        console.error("❌ Database connection failed:", err);
        return;
    }
    console.log("✅ Connected to MySQL");
});

// ================================
// USER REGISTRATION
// ================================
app.post("/register", async (req, res) => {
    const { name, surname, id_number, phone, email, password } = req.body;

    try {
        const hash = await bcrypt.hash(password, 10);

        const sql = `
            INSERT INTO users (name, surname, id_number, phone, email, password_hash)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        db.query(sql, [name, surname, id_number, phone, email, hash], (err) => {
            if (err) {
                if (err.code === "ER_DUP_ENTRY") {
                    return res.status(400).json({ message: "User already exists" });
                }
                return res.status(500).json(err);
            }
            res.json({ message: "✅ User registered successfully" });
        });

    } catch (error) {
        res.status(500).json(error);
    }
});

// ================================
// USER LOGIN
// ================================
app.post("/login", (req, res) => {
    const { email, password } = req.body;

    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [email], async (err, results) => {
        if (err) return res.status(500).json(err);

        if (results.length === 0) {
            return res.status(401).json({ message: "User not found" });
        }

        const user = results[0];

        const match = await bcrypt.compare(password, user.password_hash);

        if (!match) {
            return res.status(401).json({ message: "Invalid password" });
        }

        res.json({
            message: "✅ Login successful",
            user: {
                id: user.id,
                name: user.name,
                account_type: user.account_type
            }
        });
    });
});

// ================================
// GET ALL USERS
// ================================
app.get("/users", (req, res) => {
    db.query("SELECT id, name, surname, email, account_type FROM users", (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// ================================
// CREATE TRIP
// ================================
app.post("/trips", (req, res) => {
    const { passenger_id, pickup, destination } = req.body;

    const sql = `
        INSERT INTO trips (passenger_id, pickup, destination)
        VALUES (?, ?, ?)
    `;

    db.query(sql, [passenger_id, pickup, destination], (err) => {
        if (err) return res.status(500).json(err);

        res.json({ message: "🚗 Trip created successfully" });
    });
});

// ================================
// GET ALL TRIPS
// ================================
app.get("/trips", (req, res) => {
    const sql = `
        SELECT 
            t.id,
            CONCAT(p.name, ' ', p.surname) AS passenger,
            CONCAT(d.name, ' ', d.surname) AS driver,
            t.pickup,
            t.destination,
            t.status
        FROM trips t
        JOIN users p ON t.passenger_id = p.id
        LEFT JOIN users d ON t.driver_id = d.id
        ORDER BY t.created_at DESC
    `;

    db.query(sql, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// ================================
// ADD EMERGENCY CONTACT
// ================================
app.post("/emergency", (req, res) => {
    const { user_id, name, phone, relationship } = req.body;

    const sql = `
        INSERT INTO emergency_contacts (user_id, name, phone, relationship)
        VALUES (?, ?, ?, ?)
    `;

    db.query(sql, [user_id, name, phone, relationship], (err) => {
        if (err) return res.status(500).json(err);

        res.json({ message: "📞 Emergency contact added" });
    });
});

// ================================
// GET USER EMERGENCY CONTACTS
// ================================
app.get("/emergency/:user_id", (req, res) => {
    const userId = req.params.user_id;

    db.query(
        "SELECT * FROM emergency_contacts WHERE user_id = ?",
        [userId],
        (err, results) => {
            if (err) return res.status(500).json(err);
            res.json(results);
        }
    );
});

// ================================
// START SERVER
// ================================
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});