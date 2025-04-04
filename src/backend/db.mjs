import sqlite3 from 'sqlite3';
import express from 'express';
import fs from 'fs';
import path from 'path';

const dbPath = path.resolve('.', 'docker_images.db');
console.log(`Using database file: ${dbPath}`);

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Error opening database:", err.message);
        process.exit(1);
    } else {
        console.log("Database connected successfully.");
    }
});

// Drop existing table
db.run(`DROP TABLE IF EXISTS docker_images`, (err) => {
    if (err) {
        console.error('Error dropping table:', err.message);
    } else {
        console.log('Existing table dropped successfully.');
    }

    // Create new table
    db.run(`
        CREATE TABLE docker_images (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            docker_image TEXT NOT NULL,
            desc TEXT NOT NULL,
            link TEXT NOT NULL,
            name TEXT NOT NULL
        )
    `, (err) => {
        if (err) {
            console.error('Error creating table:', err.message);
        } else {
            console.log('Table created successfully.');

            // Insert data
            db.run(`
                INSERT INTO docker_images (docker_image, desc, link, name) 
                VALUES (?, ?, ?, ?)
            `, ['nginx-cookie-sqli', "Charlie's chocolate factory has been taken over by his evil twin sister Charlize! Can you get access to her secret website?", "127.0.0.1:80", "Building_Stadium"], (err) => {
                if (err) {
                    console.error('Error inserting data:', err.message);
                } else {
                    console.log('Data inserted successfully');
                }
            });
        }
    });
});
