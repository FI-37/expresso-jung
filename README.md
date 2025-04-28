# expresso-jung

Expresso-Jung

Willkommen zu Expresso-Jung – ein Express.js-Projekt mit Pug-Templates, MariaDB-Anbindung und Bootstrap-Styling!

Projektbeschreibung

Diese Webanwendung bietet:
- Benutzerregistrierung und Login (mit Passwort-Hashing via bcryptjs und Authentifizierung über jsonwebtoken).
- Login-geschütztes Dashboard.
- Kontaktformular mit Flash-Nachrichten und Formularvalidierung.
- Responsive Design mit Bootstrap 5.
- Datenpersistenz mit einer MariaDB-Datenbank.

Die App ist in modularer Struktur aufgebaut:
- routes/ – Express-Router für Seiten, Authentifizierung und Dashboard.
- middleware/ – eigene Middleware für Authentifizierung (JWT).
- db/ – zentrale Datenbankverbindung über Connection-Pool.
- views/ – Pug-Templates für Layout und Einzelseiten.
- public/ – statische Dateien wie eigenes CSS.

Installation

1. Repository klonen:

git clone <repository-url>
cd projekt

2. Abhängigkeiten installieren:

npm install

3. .env Datei anlegen und folgende Variablen setzen:

JWT_SECRET=deinGeheimerJWTKey
SESSION_SECRET=deinGeheimesSessionPasswort
DB_HOST=deinDBHost
DB_USER=deinDBUser
DB_PASSWORD=deinDBPasswort
DB_NAME=deinDBName

4. MariaDB-Datenbank erstellen:

Nutze die SQL-Skripte aus /sql/, um die benötigten Tabellen anzulegen.

5. Server starten:

npm run dev

(Standard-Port: http://localhost:3000)

Verwendete Technologien

- Express.js – Web-Server
- Pug – Template Engine
- MariaDB – Datenbank
- Bootstrap 5 – Frontend-Framework
- jsonwebtoken – Authentifizierung
- bcryptjs – Passwort-Hashing
- connect-flash – Flash-Nachrichten
- express-session – Session Management

Besonderheiten

- Formulardaten bleiben nach Fehlern erhalten (außer Passwortfelder).
- Flash-Nachrichten blenden automatisch aus (smoothes UX).
- Logische Ordnerstruktur (Trennung von Routes, Middleware, DB, Views).
- Vollständig vorbereitet für Deployment.
