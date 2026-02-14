const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();

/* =========================
   CONFIG
========================= */

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "devsecret";

/* =========================
   MIDDLEWARE
========================= */

app.use(
  cors({
    origin: "*", // change to frontend URL after deployment
    methods: ["GET", "POST"],
  })
);

app.use(express.json());

/* =========================
   MOCK DATABASE (TEMP)
========================= */

let users = [];
let devices = [
  { id: 1, name: "Living Room Light", status: true },
  { id: 2, name: "Bedroom AC", status: false },
  { id: 3, name: "Smart TV", status: true },
];

/* =========================
   HEALTH CHECK
========================= */

app.get("/", (req, res) => {
  res.status(200).json({
    message: "SmartHome API Running 🚀",
    status: "OK",
  });
});

/* =========================
   AUTH ROUTES
========================= */

// REGISTER
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields required" });
    }

    const existingUser = users.find((u) => u.email === email);
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      id: users.length + 1,
      name,
      email,
      password: hashedPassword,
    };

    users.push(newUser);

    res.status(201).json({
      message: "Registration successful",
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// LOGIN
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = users.find((u) => u.email === email);
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful",
      token,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

/* =========================
   JWT MIDDLEWARE
========================= */

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(403).json({ error: "Access denied" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

/* =========================
   PROTECTED DEVICE ROUTES
========================= */

app.get("/api/devices", verifyToken, (req, res) => {
  res.json(devices);
});

app.post("/api/toggle/:id", verifyToken, (req, res) => {
  const id = parseInt(req.params.id);

  devices = devices.map((device) =>
    device.id === id
      ? { ...device, status: !device.status }
      : device
  );

  res.json(devices);
});

/* =========================
   START SERVER
========================= */

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
