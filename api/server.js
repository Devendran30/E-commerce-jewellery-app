require('dotenv').config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

// --- 1. Middleware ---
app.use(cors({
  origin: ["http://localhost:3000", /\.vercel\.app$/],
  credentials: true
}));
app.use(express.json());

// --- 2. Static Files (Using process.cwd() for Vercel stability) ---
const root = process.cwd();
app.use("/uploads", express.static(path.join(root, "uploads")));
app.use('/admin', express.static(path.join(root, "adminpanel", "dist")));
app.use(express.static(path.join(root, "userview", "dist")));

// --- 3. Health Check Route ---
// Try visiting /api/health first. If this works, your server is ALIVE.
app.get('/api/health', (req, res) => {
  res.json({ status: "ok", message: "Bangalore Collective Server is Running" });
});

// --- 4. Delayed Database/Route Import ---
// We wrap these in a try-catch so that if the DB fails, the server doesn't crash.
try {
  const db = require("../db");
  const razorpay = require("../razorpayConfig");

  app.use("/api/users", require("./routes/users"));
  app.use("/api/products", require("./routes/products"));
  app.use("/api/categories", require("./routes/categories"));
  app.use("/api/brands", require("./routes/brands"));
  app.use("/api/subcategories", require("./routes/subcategories"));
  app.use("/api/upload", require("./routes/upload"));
  app.use("/api/auth", require("./routes/auth"));
  app.use("/api/orders", require("./routes/orders"));
  app.use("/api/productstats", require("./routes/productstats"));
  app.use("/api/orderstats", require("./routes/orderstats"));
  app.use("/api/home-settings", require("./routes/homesettings"));
} catch (error) {
  console.error("CRITICAL: Route or DB loading failed:", error.message);
}

// --- 5. Frontend Routing ---
app.get('/admin/*', (req, res) => {
  res.sendFile(path.join(root, "adminpanel", "dist", "index.html"));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(root, "userview", "dist", "index.html"));
});

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;