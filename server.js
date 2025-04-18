import http from 'http';
import { readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const server = http.createServer(async (req, res) => {
  const filePath = path.join(__dirname, 'index.html');

  try {
    const data = await readFile(filePath, 'utf-8');
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(data);
  } catch (err) {
    res.writeHead(500);
    res.end('Fehler beim Laden der Datei');
  }
});

server.listen(3000, () => {
  console.log('Server läuft auf http://localhost:3000');
});
