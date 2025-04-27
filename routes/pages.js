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

// Kontaktseite
router.get("/contact", (req, res) => {
  res.render("contact", { title: "Kontakt" });  // <<< NUR Titel setzen!
});

// Kontaktformular absenden
router.post('/contact', (req, res) => {
  const { name, email, message } = req.body;

  console.log("Neue Kontaktanfrage:");
  console.log(`Name: ${name}`);
  console.log(`E-Mail: ${email}`);
  console.log(`Nachricht: ${message}`);

  req.flash('success', 'Vielen Dank für Ihre Nachricht!');
  res.redirect('/contact');
});

export default router;
