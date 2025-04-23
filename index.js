import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const app = express();

// __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// View-Engine & Views-Ordner
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// 📦 Middleware für Formulardaten (sehr wichtig!)
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Für JSON-Daten z. B. aus API-POSTs

// 🔸 GET / → Startseite
app.get('/', (req, res) => {
  res.render('index', {
    title: 'Erstes Express-Projekt',
    message: 'Willkommen bei Ihrem ersten Express-Server mit Pug!'
  });
});

// 🔸 GET /about → Über uns
app.get('/about', (req, res) => {
  res.render('about', { title: 'Über uns' });
});

// 🔸 GET /register → Registrierungsformular anzeigen
app.get('/register', (req, res) => {
  res.render('register');
});

// 🔸 POST /register → Formular auswerten
app.post('/register', async (req, res) => {
  const { username, name, email, password } = req.body;
  console.log('Formulardaten:', username, name, email, password);

  try {
    // Passwort hashen
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Gehashtes Passwort:', hashedPassword);

    // Hier könntest du die Daten in die DB schreiben...

    // Dummy-Antwort:
    res.send(`<p>Registrierung erfolgreich für <strong>${username}</strong>!</p>
              <p>Gehashtes Passwort: <code>${hashedPassword}</code></p>`);
  } catch (err) {
    console.error('Fehler beim Hashing:', err);
    res.status(500).send('Fehler bei der Registrierung');
  }
});

// 🔥 Fehlerbehandlung (ganz unten lassen)
app.use((err, req, res, next) => {
  console.error('Fehler:', err.message);
  console.error(err.stack);
  res.status(500).send(`<pre>${err.message}</pre>`);
});

// 🟢 Server starten
app.listen(3000, () => {
  console.log('Server läuft auf http://localhost:3000');
});
