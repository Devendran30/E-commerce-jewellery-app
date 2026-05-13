require('dotenv').config();
const express = require("express");
const cors = require("cors");
const path = require("path");

// --- Import Configs (Assumes you moved them into /api) ---
// If you don't move them, change these to "../db" and "../razorpayConfig"
const db = require("../db"); 
const razorpay = require("../razorpayConfig");

// --- Import Routes (Matches /api/routes in image_56f13b.jpg) ---
const userRoutes = require("./routes/users");
const productRoutes = require("./routes/products");
const categoryRoutes = require("./routes/categories");
const brandRoutes = require("./routes/brands");
const subcategoryRoutes = require("./routes/subcategories");
const uploadRoutes = require("./routes/upload");
const authRoutes = require("./routes/auth");
const productstats = require("./routes/productstats");
const orderstats = require("./routes/orderstats");
const orderRoutes = require("./routes/orders");
const homeSettingsRoutes = require("./routes/homesettings");

const app = express();

app.use(cors({
  origin: ["http://localhost:3000", /\.vercel\.app$/],
  credentials: true
}));
app.use(express.json());

// --- 1. Static Files (Using process.cwd() for Vercel stability) ---
const root = process.cwd();
app.use("/uploads", express.static(path.join(root, "uploads")));
app.use('/admin', express.static(path.join(root, "adminpanel", "dist")));
app.use(express.static(path.join(root, "userview", "dist")));

// --- 2. API Routes ---
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/subcategories", subcategoryRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/productstats", productstats);
app.use("/api/orderstats", orderstats);
app.use("/api/home-settings", homeSettingsRoutes);

// --- 3. Frontend Routing ---
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