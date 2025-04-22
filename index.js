import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();

// __dirname Äquivalent in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// View Engine auf Pug setzen
app.set('view engine', 'pug');

// Pfad zum "views"-Ordner explizit setzen
app.set('views', path.join(__dirname, 'views'));

// Startseite
app.get('/', (req, res) => {
  res.render('index', {
    title: 'Erstes Express-Projekt',
    message: 'Willkommen bei Ihrem ersten Express-Server mit Pug!'
  });
});

// Über-uns-Seite
app.get('/about', (req, res) => {
  res.render('about', { title: 'Über uns' });
});

// Fehlerbehandlung (optional, für Debugging)
app.use((err, req, res, next) => {
  console.error('Fehler:', err.message);
  console.error(err.stack);
  res.status(500).send(`<pre>${err.message}</pre>`);
});

// Server starten
app.listen(3000, () => {
  console.log('Server läuft auf http://localhost:3000');
});
