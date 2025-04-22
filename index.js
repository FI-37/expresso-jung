import express from 'express';
const app = express();
 
// EJS als View-Engine einrichten
app.set('view engine', 'ejs');
 
// Definieren der ersten Route
app.get('/', (req, res) => {
  res.render('index', {
    title: 'Erstes Express-Projekt',
    message: 'Willkommen bei Ihrem ersten Express-Server mit EJS!'
  });
});
 
// Weitere Route
app.get('/about', (req, res) => {
  res.render('about', {title: 'Über uns'});
});
 
// Server starten
app.listen(3000, () => {
  console.log('Server läuft auf http://localhost:3000');
});