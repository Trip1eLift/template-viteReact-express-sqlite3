import express from 'express';
import sqlite3 from 'sqlite3';
import {v4 as uuidvs} from 'uuid';
import seedDatabase from './seedDatabase.js';

await seedDatabase();

const app = express();
const port = 8080;
const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "OPTIONS,GET,POST"
}

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));

app.get("/health", (req, res) => {
    console.log("Health check endpoint is reached");
    res.send("Healthy");
});

app.get("/hello", (req, res) => {
    console.log("GET Hello World");
    console.log("Body:", req.body);
    res.set(headers);

    const db = new sqlite3.Database('../database/myapp.sqlite3', async (err) => {
        if (err)
            console.error(err);
        else {
            db.all("SELECT * FROM users;", [], (err, rows) => {
                if (rows && err == null) {
                    res.send({message: "Hello World from backend", rows: rows});
                }
            });
        }
    });
});

app.options("/hello", (req, res) => {
    res.set(headers);
    res.send("preflight response");
});

const logger = (req, res, next) => {
    console.log("Unexpected path:", req.url);
    next();
}

app.use(logger);

const server = app.listen(port, () => {
    console.log("Listening on port:", port);
});

async function closeGracefully(signal) {
    console.log(`Received termated signal: ${signal}; process terminated...`);
    await server.close();
    process.exit();
}
process.on("SIGINT", closeGracefully);
process.on("SIGTERM", closeGracefully);