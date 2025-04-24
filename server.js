import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";
import mariadb from "mariadb";
// import session from "express-session"; // Express-Server
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser'; // Cookies

import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;



const app = express();
app.use(cookieParser());

// __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



// Statische Dateien (wie Bilder, CSS, JS) aus dem "public"-Ordner bereitstellen
app.use(express.static(path.join(__dirname, "public")));

// Middleware für Cookies
app.use((req, res, next) => {
  const token = req.cookies.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      res.locals.user = decoded;
    } catch {
      res.locals.user = null;
    }
  } else {
    res.locals.user = null;
  }
  next();
});

// Datenbankverbindung
const pool = mariadb.createPool({
  host: "ajubuntu",
  user: "alexjung",
  password: "links234",
  database: "test_db",
  connectionLimit: 5,
});

// View-Engine & Views-Ordner
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// Middleware für Formulardaten
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Middleware zur Authentifizierung mit JWT
// Diese Funktion prüft, ob ein gültiger JWT-Token im Cookie vorhanden ist.
// Wenn ja, wird der Benutzer in `req.user` gespeichert und weitergeleitet (next())
// Wenn nicht, erfolgt eine Weiterleitung zur Login-Seite
function authenticateToken(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.redirect("/login");

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Ungültiger Token:", err.message);
    res.clearCookie("token");
    res.redirect("/login");
  }
}


// Startseite
app.get("/", (req, res) => {
  res.render("index", {
    title: "Erstes Express-Projekt",
    message: "Willkommen bei Ihrem ersten Express-Server mit Pug!",
  });
});

// Über-uns-Seite
app.get("/about", (req, res) => {
  res.render("about", { title: "Über uns" });
});

// -----------------------------------------------------------------------------------------------

// Registrierung anzeigen
app.get("/register", (req, res) => {
  if (res.locals.user) {
    return res.redirect("/dashboard");
  }
  res.render("register");
});



// Registrierung verarbeiten
app.post("/register", async (req, res) => {
  const { username, name, email, password, confirm } = req.body;

  if (password !== confirm) {
    return res.render("register", {
      error: "Passwörter stimmen nicht überein.",
      username,
      name,
      email
    });
  }

  try {
    // Passwort hashen
    const hashedPassword = await bcrypt.hash(password, 10);

    // Verbindung zur DB holen
    const conn = await pool.getConnection();

    try {
      // Daten einfügen
      await conn.query(
        "INSERT INTO user (username, name, email, password_hash) VALUES (?, ?, ?, ?)",
        [username, name, email, hashedPassword]
      );

      // Erfolg → Weiterleitung zur Login-Seite via timer in register.pug
      return res.render("register", {
        success: "Registrierung erfolgreich!",
      });
      

    } catch (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(400).render('register', {
          error: 'Diese E-Mail-Adresse ist bereits registriert.',
          username,
          name,
          email
        });
        
      }

      console.error("Fehler beim INSERT:", err);
      res.status(500).send("Fehler beim Speichern in der Datenbank");
    } finally {
      conn.release();
    }
  } catch (err) {
    console.error("Fehler bei Registrierung:", err);
    res.status(500).send("Fehler bei der Registrierung");
  }
});

// -----------------------------------------------------------------------------------------------
// Login-Seite anzeigen

// Registrierung validieren
app.get("/login", (req, res) => {
  res.render("login");
});

// Login verarbeiten
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const conn = await pool.getConnection();

    try {
      const rows = await conn.query("SELECT * FROM user WHERE username = ?", [
        username,
      ]);

      if (rows.length === 0) {
        return res.status(401).send("Benutzer nicht gefunden");
      }

      const user = rows[0];
      const match = await bcrypt.compare(password, user.password_hash);

      if (!match) {
        return res.status(401).send("Falsches Passwort");
      }

      // Erfolgreich eingeloggt → Session speichern
      const token = jwt.sign(
        {
          username: user.username,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
        },
        JWT_SECRET, // sicher aus .env
        { expiresIn: '1h' }
      );
      
      
      res.cookie('token', token, { httpOnly: true }).redirect('/dashboard');
      
    } finally {
      conn.release();
    }
  } catch (err) {
    console.error("Login-Fehler:", err);
    res.status(500).send("Interner Fehler beim Login");
  }
});

// -----------------------------------------------------------------------------------------------
// Geschützte Seite (Dashboard)

// Geschützte Route: Nur zugänglich, wenn gültiges JWT-Token vorhanden ist
// Die Authentifizierung übernimmt die Middleware "authenticateToken"

// Dashboard ist jetzt mit JWT geschützt
app.get("/dashboard", authenticateToken, (req, res) => {
  res.render("dashboard", {
    user: req.user, // kommt aus dem verifizierten JWT
  });
});


// -----------------------------------------------------------------------------------------------
// Logout verarbeiten

// Logout verarbeiten (JWT-basiert)
app.get("/logout", (req, res) => {
  res.clearCookie("token"); // Token löschen → "ausloggen"
  res.redirect("/");
});


// -----------------------------------------------------------------------------------------------

// Fehlerbehandlung
app.use((err, req, res, next) => {
  console.error("Fehler:", err.message);
  console.error(err.stack);
  res.status(500).send(`<pre>${err.message}</pre>`);
});

// Server starten
app.listen(3000, () => {
  console.log("Server läuft auf http://localhost:3000");
});
