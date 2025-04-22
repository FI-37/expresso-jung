import mariadb from 'mariadb';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Pool wird beim Start erstellt, aber Verbindung pro Anfrage geholt
const pool = mariadb.createPool({
  host: 'ajubuntu',
  user: 'alexjung',
  password: 'links23',
  database: 'test_db',
  connectionLimit: 5
});

// Server
const server = http.createServer(async (req, res) => {
  // Verbindung zur Datenbank vorbereiten
  let connection;

  try {
    // Verbindung aus dem Pool holen
    connection = await pool.getConnection();

    // Beispiel-Abfrage
    const todos = await connection.query("SELECT * FROM todo");

    // Als JSON senden
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(todos));

  } catch (err) {
    // Fehlerbehandlung
    console.error('Fehler bei der Datenbankabfrage:', err.message);

    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Fehler beim Laden der Daten');

  } finally {
    // Verbindung immer freigeben – wichtig!
    if (connection) connection.release();
  }
});
