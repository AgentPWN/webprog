import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';  // Convert module URL to a path
import { dockerize } from './docker.mjs'; // Import dockerize function
import sqlite3 from 'sqlite3';
import cors from 'cors';
import fs from 'fs';

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
app.use(express.json());  

// Recreate __dirname using import.meta.url
const __dirname = path.dirname(fileURLToPath(import.meta.url));
console.log(__dirname);
app.use(express.static(path.join(__dirname, '../../')));
app.use('/node_modules', express.static(path.join(__dirname, '../../node_modules')));

app.post('/api/checkflag', async(req,res)=>{
    const {id,flag} = req.body;
    res.status(200).json({message:"Flag is correct!!"});
});

app.get('/api/files/noncyberpunk',async(req,res)=>{
    const directory = path.join(__dirname,'../models/buildings/noncyberpunk');
    fs.readdir(directory,(err,files)=>{
        if (err){
            return res.status(500).json({error:`unable to scan directory:${err}`});
        }
        else{
            res.json({files});
        }
    });
});
app.get('/api/files/cyberpunk',async(req,res)=>{
    const directory = path.join(__dirname,'../models/buildings/cyberpunk');
    fs.readdir(directory,(err,files)=>{
        if (err){
            return res.status(500).json({error:`unable to scan directory:${err}`});
        }
        else{
            res.json({files});
        }
    });
});


app.get('/api/:id', async (req, res) => {
    try {
        const buildingname = req.params.id;
        console.log("Received request for:", buildingname);

        db.get(
            'SELECT docker_image, desc, link FROM docker_images WHERE name = ?',
            [buildingname],
            async (err, row) => {
                if (err) {
                    console.error('Database error:', err.message);
                    return res.status(500).json({ error: 'Database error' });
                }

                if (!row) {
                    return res.status(404).json({ error: 'Image not found' });
                }
                // console.log(row.docker_image)
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
