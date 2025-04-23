import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";
import mariadb from "mariadb";
import session from "express-session"; // Express-Server

// __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Statische Dateien (wie Bilder, CSS, JS) aus dem "public"-Ordner bereitstellen
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: "mein-geheimnis", // kann beliebig sein
    resave: false,
    saveUninitialized: false,
  })
);

// Macht den aktuell eingeloggten Benutzer (Session) in allen Pug-Templates als "user" verfügbar
app.use((req, res, next) => {
  res.locals.user = req.session.user;
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
  res.render("register");
});

// Registrierung verarbeiten
app.post("/register", async (req, res) => {
  const { username, name, email, password } = req.body;

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

      // Erfolg → Weiterleitung zur Login-Seite (kannst du später bauen)
      res.status(201).redirect("/login");
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
      req.session.user = {
        id: user.id,
        username: user.username,
        name: user.name,
        avatar: user.avatar,
      };

      // Weiterleitung zum geschützten Bereich
      res.redirect("/dashboard");
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

app.get("/dashboard", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  res.render("dashboard", {
    user: req.session.user,
  });
});

// -----------------------------------------------------------------------------------------------
// Logout verarbeiten

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout-Fehler:", err);
    }
    res.redirect("/login");
  });
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
