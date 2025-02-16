import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';  // Import fileURLToPath to convert the module URL to a path
import { dockerize } from './docker.mjs'; // Import the dockerize function
import sqlite3 from 'sqlite3';
const db = new sqlite3.Database('bug_reports.db', (err) => {
    if (err) {
        console.error('Database connection error:', err.message);
    } else {
        console.log('Connected to SQLite database');
    }
});

db.run(`
    CREATE TABLE IF NOT EXISTS bug_reports (
        name TEXT NOT NULL PRIMARY KEY,
        message TEXT NOT NULL
    )
`, (err) => {
    if (err) {
        console.error('Error creating table:', err.message);
    }
});
const app = express();
const PORT = 3000;

// Recreate __dirname using import.meta.url
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));

app.get('/api/:buildingid', async (req, res) => {
    try {
      const buildingid = req.params.buildingid;
      console.log('1');
      await dockerize(imageName, res);  // Pass res to dockerize
    } catch (err) {
      console.error('Error:', err);
      res.status(500).json({ error: 'Failed to start the challenge container.' });
    }
  });
  

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
