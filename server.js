//----------------------------------------------------------------------------------------------//
//                                    Imports & Initialisierung
//----------------------------------------------------------------------------------------------//

import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser"; // Cookies

import dotenv from "dotenv";
dotenv.config();

import session from "express-session";
import flash from "connect-flash";

import pagesRoutes from './routes/pages.js';
import authRoutes from './routes/authRoutes.js';
import dashboardRoutes from './routes/dashboard.js';
import { authenticateToken } from './middleware/authMiddleware.js';
import pool from './db/db.js';

const app = express();
app.use(cookieParser());

const SESSION_SECRET = process.env.SESSION_SECRET; // Geheimes Psw aus .env holen für die Session-Initialisierung

// Flash Messages
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// Ermittle __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//------------------------------------------------------------------------------------------------//
//                                     Statische Dateien & View-Engine
//------------------------------------------------------------------------------------------------//

// Statische Dateien (wie Bilder, CSS, JS) aus dem "public"-Ordner bereitstellen
app.use(express.static(path.join(__dirname, "public")));

// View-Engine & Views-Ordner
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

//------------------------------------------------------------------------------------------------//
//                                     Middleware: Cookies & Formulardaten
//------------------------------------------------------------------------------------------------//

// JWT-Token aus Cookie prüfen und Benutzer global in res.locals.user bereitstellen (z.B. für Navbar, Views etc.)
app.use((req, res, next) => {
  const token = req.cookies.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      res.locals.user = decoded;
    } catch {
      res.locals.user = null;
    }
  } else {
    res.locals.user = null;
  }
  next();
});

// Middleware für Formulardaten
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Flash-Messages initialisieren
app.use(flash());

// Flash-Nachrichten in Pug verfügbar machen
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// Seitenrouten (Startseite, About)
app.use('/', pagesRoutes);
// Authentifizierung (Login, Registrierung)
app.use('/', authRoutes);
// Dashboard (geschützt)
app.use('/', dashboardRoutes);

app.locals.pool = pool; // Datenbankverbindung global verfügbar machen

//------------------------------------------------------------------------------------------------//
//                                 Fehlerbehandlung, Export & Serverstart
//------------------------------------------------------------------------------------------------//

// Fehlerbehandlung
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send(`<pre>${err.message}</pre>`);
});

// Export für Route-Zugriff (z. B. Middleware)
export { app, authenticateToken };

// Server starten
app.listen(3000, () => {
  console.log("Server läuft auf http://localhost:3000");
});
