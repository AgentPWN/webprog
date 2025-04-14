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
                VALUES 
                    ('nginx-cookie-sqli', "Charlie's chocolate factory has been taken over by his evil twin sister Charlize! Can you get access to her secret website?", "127.0.0.1:80", "Building_Stadium"),
                    ('none-alg-jwt', "JWTs are very secure right, they don't have any weird algorithms you can use right? RIGHT?", "127.0.0.1:5000", "Building_Bakery001"),
                    ('ssrf', "I am sure it is secure to visit other urls. My server should be fine", "127.0.0.1:5002", "Building_Gift_Shop"),
                    ('robots', "Do you think web crawlers can visit every endpoint of a website?", "127.0.0.1:5003", "Building_Residential_color01"),
                    ('easy_sqli', "Do you like injections?", "127.0.0.1:5004", "Building_Factory"),
                    ('directory_traversal', "Can you directly traverse this website?", "127.0.0.1:5005", "Building_Coffee_Shop"),
                    ('weak-jwt-secret', "Did you know JWTs have secrets too?", "127.0.0.1:5001", "Building_Gas_Station")
            `, (err) => {
                if (err) {
                    console.error('Error inserting data:', err.message);
                } else {
                    console.log('Data inserted successfully');
                }
            });
        }
    });
});
