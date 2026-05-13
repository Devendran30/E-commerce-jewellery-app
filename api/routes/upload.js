const express = require("express");
const router = express.Router();
const multer = require("multer");

// Use Memory Storage to bypass Vercel's read-only file system
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No image file provided" });
  }

  // On Vercel, files in memory must be sent to a service like Cloudinary 
  // to be saved permanently. For now, this will stop the crash.
  res.json({ 
    message: "File received successfully (Memory Mode)",
    filename: req.file.originalname 
  });
});

module.exports = router;