import express from 'express';
import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = 2001;

app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));

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

app.post('/api/bug_report', (req, res) => {
    const { name, message } = req.body;

    if (!name || !message) {
        return res.status(400).json({ error: 'Name and message are required' });
    }

    db.run(`INSERT INTO bug_reports (name, message) VALUES (?, ?)`, [name, message], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: this.lastID, name, message });
    });

    // Assuming bot.js has a function `report()` that you want to call
    import('./bot.js').then((botModule) => {
    // Ensure the report function is defined in bot.js
    }).catch(err => console.error('Error importing bot module:', err));
});

app.get('/api/reports', (req, res) => {
    db.all("SELECT * FROM bug_reports", (err, rows) => {
        if (err) {
            return res.status(500).json({ err: err.message });
        }
        res.json({ reports: rows });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
