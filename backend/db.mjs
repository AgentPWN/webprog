import sqlite3 from 'sqlite3';
import express from 'express';
const db = new sqlite3.Database('docker_images.db',(err)=>{
    if (err){
        console.log("error message",err.message);
    }
    else{
        console.log("database connected")
    }
});
console.log(1)
db.run(`
    CREATE TABLE IF NOT EXISTS docker_images (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        docker_image TEXT NOT NULL
    )
`, (err) => {
    if (err) {
        console.error('Error creating table:', err.message);
    }
});
db.run(`
    INSERT INTO docker_images (docker_image) 
    VALUES (?)
`, ['nginx-cookie-sqli'], (err) => {
    if (err) {
        console.error('Error inserting data:', err.message);
    } else {
        console.log('Data inserted successfully');
    }
});
