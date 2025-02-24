import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';  // Import fileURLToPath to convert the module URL to a path
import { dockerize } from './docker.mjs'; // Import the dockerize function
import sqlite3 from 'sqlite3';
const db = new sqlite3.Database('docker_images.db', (err) => {
    if (err) {
        console.error('Database connection error:', err.message);
    } else {
        console.log('Connected to SQLite database');
    }
});

// db.run(`
//     select * from docker_images;
// `, (err) => {
//     if (err) {
//         console.error('Error creating table:', err.message);
//     }
// });
const app = express();
const PORT = 3000;

// Recreate __dirname using import.meta.url
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.static(path.join(__dirname, '../frontend')));


app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));



app.get('/api/:buildingid', async (req, res) => {
  try {
    const buildingid = req.params.buildingid;
    
    db.get(
      'SELECT docker_image FROM docker_images WHERE id = ? OR docker_image = ?',
      [buildingid, 'nginx_cookie_sqli'],
      async (err, row) => {
        if (err) {
          console.error('Database error:', err.message);
          return res.status(500).json({ error: 'Database error' });
        }
        
        if (!row) {
          return res.status(404).json({ error: 'Image not found' });
        }
        
        const imageName = row.docker_image;
        console.log('Image name:', imageName);
        
        await dockerize(imageName, res);
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
