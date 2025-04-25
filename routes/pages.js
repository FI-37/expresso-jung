// routes/pages.js
import express from 'express';
const router = express.Router();

// Startseite
router.get("/", (req, res) => {
  res.render("index", {
    title: "Erstes Express-Projekt",
    message: "Willkommen bei Ihrem ersten Express-Server mit Pug!",
  });
});

// Über uns
router.get("/about", (req, res) => {
  res.render("about", { title: "Über uns" });
});

export default router;
