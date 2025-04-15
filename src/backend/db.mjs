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
db.run(`DROP TABLE IF EXISTS docker_images`, (err) => {
    if (err) {
        console.error('Error dropping table:', err.message);
    } else {
        console.log('Existing table dropped successfully.');
    }
    db.run(`
        CREATE TABLE docker_images (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            docker_image TEXT NOT NULL,
            desc TEXT NOT NULL,
            link TEXT NOT NULL,
            name TEXT NOT NULL,
            flag TEXT NOT NULL
        )
    `, (err) => {
        if (err) {
            console.error('Error creating table:', err.message);
        } else {
            console.log('Table created successfully.');
            db.run(`
                INSERT INTO docker_images (docker_image, desc, link, name, flag) 
                VALUES 
                    ('nginx-cookie-sqli', "Charlie's chocolate factory has been taken over by his evil twin sister Charlize! Can you get access to her secret website?", "127.0.0.1:80", "Building_Stadium", "nite{ch0col47e_ch1p_c00k135_kind4_g0at3d}"),
                    ('none-alg-jwt', "JWTs are very secure right, they don't have any weird algorithms you can use right? RIGHT?", "127.0.0.1:5000", "Building_Bakery001", "flag{jwt_n0n3_4lg0_byp4ss_1s_d4ng3r0us}"),
                    ('ssrf', "I am sure it is secure to visit other urls. My server should be fine", "127.0.0.1:5002", "Building_Gift_Shop", "flag{n4h_man_h0w_did_I_mes5_up_th1s_64d}"),
                    ('robots', "Do you think web crawlers can visit every endpoint of a website?", "127.0.0.1:5003", "Building_Residential_color01", "flag{rob0ts_txt_l34ks_4r3_d4ng3r0us}"),
                    ('easy_sqli', "Do you like injections?", "127.0.0.1:5004", "Building_Factory", "flag{1t'5_alm057_t0_e45y}"),
                    ('directory_traversal', "Can you directly traverse this website?", "127.0.0.1:5005", "Building_Coffee_Shop", "flag{d1r_7rav3rsal_15_fun}"),
                    ('weak-jwt-secret', "Did you know JWTs have secrets too?", "127.0.0.1:5001", "Building_Gas_Station", "flag{y0u_br0k3_7h3_jw7}"),
                    ('simple-csp-xss-backend', "I love the part where he said it is scripting time", "127.0.0.1:2001", "Building_House_04_color01001", "flag{d4mn_you_kn0w_how_Xs5_w0rk5}")
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
