import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';  
import { dockerize } from './docker.mjs';
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
app.use(cors());
app.use(express.json());  
const __dirname = path.dirname(fileURLToPath(import.meta.url));
console.log(__dirname);
app.use(express.static(path.join(__dirname, '../../')));
app.use('/node_modules', express.static(path.join(__dirname, '../../node_modules')));
app.post('/api/checkflag', async (req, res) => {
    db.get(
        'SELECT docker_image FROM docker_images WHERE name = ? AND flag = ?',
        [req.body.id, req.body.flag],
        async (err, row) => {
            if (err) {
                console.error('Database error:', err.message);
                return res.status(500).json({ error: 'Database error' });
            }

            if (!row) {
                return res.status(404).json({ message: 'error' , error:"wrong"});
            }

            res.status(200).json({ name: row.docker_image });
            dockerize(row.docker_image).catch(dockerErr => {
                console.error('Docker error:', dockerErr.message);
            });
        }
    );
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
                console.log('Image found:', row.docker_image);
                res.status(200).json({ desc: row.desc, link: row.link });
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
