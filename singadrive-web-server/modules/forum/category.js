const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const { Pool } = require('pg');
const postgresPool = new Pool({
    host: 'localhost',
    database: process.env.POSTGRES_DB,

    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    port: 5432
});

const mongoConfig = {
    url: `mongodb://127.0.0.1:27017/${process.env.MONGODB_DB}`,
    dbName: `${process.env.MONGODB_DB}`
};

router.get("/get-categories", async (req, res) => {
    try {
        const client = await postgresPool.connect();
        let query = `SELECT * FROM "forum"."section_categories";`;

        const { rows } = await client.query(query);
        console.log(rows);
        if (rows.length <= 0) {
            // NOTE: Should always have rows.
            res.status(500).json({ message: "Internal Server Error" });
        } else {
            res.status(200).json(rows);
        }
        client.release();
    } catch (error) {
        console.error('Error fetching all categories.', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;