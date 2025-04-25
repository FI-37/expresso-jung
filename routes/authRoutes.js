import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

// Registrierung anzeigen
router.get("/register", (req, res) => {
  if (res.locals.user) return res.redirect("/dashboard");
  const formData = req.session.formData || {};
  req.session.formData = null;
  res.render("register", { formData });
});

// Registrierung verarbeiten
router.post("/register", async (req, res) => {
  const { username, name, email, password, confirm } = req.body;

  if (password !== confirm) {
    req.session.formData = { username, name, email };
    req.flash("error", "Passwörter stimmen nicht überein.");
    return res.redirect("/register");
  }

  if (password.length < 8 || !/\d/.test(password) || !/[!@#$%^&*]/.test(password)) {
    req.session.formData = { username, name, email };
    req.flash("error", "Passwort muss mindestens 8 Zeichen, eine Zahl und ein Sonderzeichen enthalten.");
    return res.redirect("/register");
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const conn = await req.app.locals.pool.getConnection();

    try {
      await conn.query(
        "INSERT INTO user (username, name, email, password_hash) VALUES (?, ?, ?, ?)",
        [username, name, email, hashedPassword]
      );
      req.flash("success", "Registrierung erfolgreich! Du kannst dich jetzt einloggen.");
      return res.redirect("/login");
    } catch (err) {
      if (err.code === "ER_DUP_ENTRY") {
        req.session.formData = { username, name, email };
        req.flash("error", "E-Mail oder Benutzername bereits vergeben.");
        return res.redirect("/register");
      }
      throw err;
    } finally {
      conn.release();
    }
  } catch (err) {
    console.error("Registrierung fehlgeschlagen:", err);
    res.status(500).send("Fehler bei der Registrierung");
  }
});

// Login anzeigen
router.get("/login", (req, res) => {
  res.render("login");
});

// Login verarbeiten
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const conn = await req.app.locals.pool.getConnection();
    const rows = await conn.query("SELECT * FROM user WHERE username = ?", [username]);
    const user = rows[0];

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      req.flash("error", "Benutzername oder Passwort ungültig");
      return res.redirect("/login");
    }

    const token = jwt.sign(
      { id: user.id,
        username: user.username,
        name: user.name,
        avatar: user.avatar},
      JWT_SECRET,
      { expiresIn: "30s" }
    );

    res.cookie("token", token, { httpOnly: true }).redirect("/dashboard");
  } catch (err) {
    console.error("Login-Fehler:", err);
    res.status(500).send("Fehler beim Login");
  }
});

// Logout
router.get("/logout", (req, res) => {
  res.clearCookie("token"); // JWT-Cookie löschen
  res.redirect("/login");   // oder zurück zur Startseite: res.redirect("/")
});

export default router;
