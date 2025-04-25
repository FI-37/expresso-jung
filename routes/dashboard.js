// routes/dashboard.js
import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';  // Middleware aus Datei importieren


const router = express.Router();

// Geschützte Route mit Middleware
router.get("/dashboard", authenticateToken, (req, res) => {
  res.render("dashboard", {
    user: req.user,
  });
});

export default router;
