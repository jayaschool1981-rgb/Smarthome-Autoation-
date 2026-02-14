const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const helmet = require("helmet");
require("dotenv").config();

const app = express();

/* =========================
   CONFIG
========================= */

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error("❌ JWT_SECRET is missing in environment variables");
  process.exit(1);
}

/* =========================
   MIDDLEWARE
========================= */

// Security headers
app.use(helmet());

// CORS configuration (replace with your frontend URL)
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

// Body parser with size limit
app.use(express.json({ limit: "10kb" }));

/* =========================
   MOCK DATABASE (TEMP)
   ⚠ Replace with real DB later
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
    timestamp: new Date(),
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
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = users.find((u) => u.email === email);
    if (existingUser) {
      return res.status(409).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = {
      id: users.length + 1,
      name,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    };

    users.push(newUser);

    res.status(201).json({
      message: "Registration successful",
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ error: "Internal server error" });
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
      {
        id: user.id,
        email: user.email,
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/* =========================
   JWT MIDDLEWARE
========================= */

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(403).json({ error: "Access denied" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

/* =========================
   PROTECTED DEVICE ROUTES
========================= */

app.get("/api/devices", verifyToken, (req, res) => {
  res.status(200).json(devices);
});

app.post("/api/toggle/:id", verifyToken, (req, res) => {
  const id = parseInt(req.params.id);

  const deviceExists = devices.find((d) => d.id === id);
  if (!deviceExists) {
    return res.status(404).json({ error: "Device not found" });
  }

  devices = devices.map((device) =>
    device.id === id
      ? { ...device, status: !device.status }
      : device
  );

  res.status(200).json({
    message: "Device status updated",
    devices,
  });
});

/* =========================
   GLOBAL ERROR HANDLER
========================= */

app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);
  res.status(500).json({ error: "Something went wrong" });
});

/* =========================
   START SERVER
========================= */

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
