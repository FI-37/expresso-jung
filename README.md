# Expresso-Jung

## Projektübersicht
Dieses Projekt ist ein einfacher Webserver auf Basis von **Express.js** und **Pug**.  
Ziel war es, eine kleine Website mit Benutzer-Authentifizierung und Kontaktformular zu entwickeln.

## Hauptfunktionen
- **Benutzerregistrierung** (mit Passwort-Validierung und Hashing)
- **Benutzer-Login** (mit JWT-Token und Cookie-Handling)
- **Dashboard** für eingeloggte User
- **Kontaktformular** mit Flash-Messages
- **Bootstrap 5** für modernes, responsives Design
- **dotenv** zum sicheren Verwalten von Umgebungsvariablen

## Verwendete Technologien
- Node.js
- Express.js
- Pug (als Template-Engine)
- MariaDB (als Datenbank)
- bcryptjs (zum Hashen von Passwörtern)
- jsonwebtoken (für Login-Sessions)
- Bootstrap (über CDN eingebunden)

## Projektstruktur
- `/routes/` – Enthält die Route-Handler (`pages`, `authRoutes`, `dashboard`)
- `/middleware/` – Authentifizierungs-Middleware
- `/db/` – Verbindungsaufbau zur MariaDB-Datenbank
- `/views/` – Pug-Templates für die Seiten
- `/public/` – Statische Dateien (z.B. CSS)

## Einrichtung
1. **Repository klonen**
2. **Abhängigkeiten installieren:**
   ```
   npm install
   ```
3. **.env Datei erstellen** mit:
   ```
   SESSION_SECRET=dein-session-geheimnis
   JWT_SECRET=dein-jwt-geheimnis
   DB_HOST=dein-db-host
   DB_USER=dein-db-user
   DB_PASSWORD=dein-db-passwort
   DB_NAME=deine-db
   ```
4. **Server starten:**
   ```
   npm run dev
   ```

Server läuft standardmäßig unter:  
➡️ http://localhost:3000

## Hinweise
- Sessions werden mit express-session gespeichert (temporär im RAM).
- Die Flash-Nachrichten (Erfolg/Fehler) werden automatisch wieder ausgeblendet.
- Passwörter werden sicher gehasht in der Datenbank gespeichert.
- Die Datei `.env` wird **nicht** mit hochgeladen oder geteilt. Sie enthält sensible Daten.  
  Du musst sie selbst erstellen, bevor du den Server startest.

---

© 2024 by Alex Jung  
