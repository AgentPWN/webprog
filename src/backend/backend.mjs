import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';  // Convert module URL to a path
import { dockerize } from './docker.mjs'; // Import dockerize function
import sqlite3 from 'sqlite3';
import cors from 'cors';

const db = new sqlite3.Database('docker_images.db', (err) => {
    if (err) {
        console.error('Database connection error:', err.message);
    } else {
        console.log('Connected to SQLite database');
    }
});

const app = express();
const PORT = 3001;
app.use(cors()); // Enable CORS globally

// Recreate __dirname using import.meta.url
const __dirname = path.dirname(fileURLToPath(import.meta.url));
console.log(__dirname);
app.use(express.static(path.join(__dirname, '../../')));
app.use('/node_modules', express.static(path.join(__dirname, '../../node_modules')));

app.get('/api/:id', async (req, res) => {
    try {
        const buildingid = req.params.id;
        console.log("Received request for:", buildingid);

        db.get(
            'SELECT docker_image, desc, link FROM docker_images WHERE id = ? OR docker_image = ?',
            [buildingid, 'nginx_cookie_sqli'],
            async (err, row) => {
                if (err) {
                    console.error('Database error:', err.message);
                    return res.status(500).json({ error: 'Database error' });
                }

                if (!row) {
                    return res.status(404).json({ error: 'Image not found' });
                }

                console.log('Image found:', row.docker_image);

                // Send JSON response first
                res.status(200).json({ desc: row.desc, link: row.link });

                // Start the Docker container asynchronously (doesn't block response)
                // Start the Docker container asynchronously (doesn't block response)
                dockerize(row.docker_image).catch(dockerErr => {
                  console.error('Docker error:', dockerErr.message);
                });

            }
        );

    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'Failed to start the challenge container.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
