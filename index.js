import http from 'http';

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hallo Express-Welt!');
});

server.listen(3000, () => {
  console.log('Server läuft auf http://localhost:3000');
});
