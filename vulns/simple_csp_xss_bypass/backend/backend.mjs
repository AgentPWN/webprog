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
db.run(`DROP TABLE IF EXISTS bug_reports`, (err) => {
    if (err) {
        console.error('Error dropping table:', err.message);
    } else {
        console.log('Existing table dropped successfully.');
    }
});
db.run(`
    CREATE TABLE IF NOT EXISTS bug_reports (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        message TEXT NOT NULL,
        title TEXT DEFAULT 'Bug Report',
        status TEXT DEFAULT 'open',
        date TEXT DEFAULT (DATE('now'))
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

    const title = "Bug Report";
    const status = "open";
    const date = new Date().toISOString().split("T")[0];

    const sql = `INSERT INTO bug_reports (title, name, message, status, date)
                 VALUES (?, ?, ?, ?, ?)`;

    db.run(sql, [title, name, message, status, date], function (err) {
        if (err) {
            console.error("SQL Error:", err.message);
            return res.status(500).json({ error: err.message });
        }

        res.status(201).json({ id: this.lastID, name, message });
    });

    import('./bot.js').then((botModule) => {
        const module = botModule.default || botModule;
        const urlToVisit = 'http://localhost:2001/reports.html';

        module.bot(urlToVisit)
            .then(result => console.log('Bot completed with result:', result))
            .catch(err => console.error('Error running bot:', err));
    }).catch(err => console.error('Error importing bot module:', err));
});

app.get('/api/reports', (req, res) => {
    db.all("SELECT * FROM bug_reports", (err, rows) => {
        if (err) {
            return res.status(500).json({ err: err.message });
        }
        // console.log({reports:rows})
        res.json({ reports: rows });
    });
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
