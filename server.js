require('dotenv').config();
const express = require("express");
const cors = require("cors");
const path = require("path");

// --- Import Routes ---
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

// --- Middleware ---
// Optimized CORS for Vercel + Local Development
app.use(cors({
  origin: ["http://localhost:3000", /\.vercel\.app$/],
  credentials: true
}));
app.use(express.json());

// --- 1. Static Files (Images) ---
// Note: Vercel filesystem is READ-ONLY. Uploads will work for viewing 
// existing files, but new uploads via Multer won't persist on Vercel.
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --- 2. Serve Built Frontend Files ---
// Changed '../' to './' because server.js is now in the ROOT
app.use('/admin', express.static(path.join(__dirname, "adminpanel", "dist")));
app.use(express.static(path.join(__dirname, "userview", "dist")));

// --- 3. API Routes ---
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

// --- 4. React/Next.js Routing ---
// Admin Panel Catch-all
app.get('/admin/*', (req, res) => {
  res.sendFile(path.join(__dirname, "adminpanel", "dist", "index.html"));
});

// User View Catch-all (Main Website)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, "userview", "dist", "index.html"));
});

// --- Server Startup ---
const PORT = process.env.PORT || 5000;

// This condition prevents the server from trying to "listen" twice on Vercel
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

// --- CRITICAL FOR VERCEL ---
module.exports = app;