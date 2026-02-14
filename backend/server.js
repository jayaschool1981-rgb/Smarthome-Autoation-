const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

const SECRET_KEY = "supersecretkey"; // later move to .env

// Mock database
let users = [];
let devices = [
  { id: 1, name: "Living Room Light", status: true },
  { id: 2, name: "Bedroom AC", status: false },
  { id: 3, name: "Smart TV", status: true },
];

// Health check
app.get("/", (req, res) => {
  res.json({ message: "SmartHome API Running 🚀" });
});

/* =========================
   AUTH ROUTES
========================= */

// Register
app.post("/api/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "All fields required" });
  }

  const userExists = users.find((u) => u.email === email);
  if (userExists) {
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

  res.json({ message: "Registration successful" });
});

// Login (Generate JWT)
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  const user = users.find((u) => u.email === email);
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // 🔥 Generate token
  const token = jwt.sign(
    { id: user.id, email: user.email },
    SECRET_KEY,
    { expiresIn: "1h" }
  );

  res.json({
    message: "Login successful",
    token,
  });
});

/* =========================
   JWT Middleware
========================= */

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(403).json({ error: "Access denied" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Invalid token" });
    }

    req.user = decoded;
    next();
  });
};

/* =========================
   PROTECTED ROUTES
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

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
