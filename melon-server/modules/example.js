const express = require('express');
const router = express.Router();

const { Pool } = require('pg');

// Create a PostgreSQL connection pool
const pool = new Pool({
    host: 'localhost',
    database: process.env.POSTGRES_DB,
    
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    port: 5432, 
  });

router.get('/postgres', async (req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT some_data FROM example');
    
        // Extract the 'some_data' columns and store them in an array
        const someDataArray = result.rows.map(row => 
            {
                console.log(row.some_data);
                return row.some_data;
            });
    
        // Release client back to the connection pool.
        client.release(); 
        res.json({"result": someDataArray}); 
    } catch (error) {
        console.error('Error executing query', error);
        res.status(500).send('Internal Server Error');
      }
});

// Notice the 'post()' method being used instead.
// This is for POST headers.
router.post('/postgresman', async (req, res) => {
    console.log("I got it!");
    try {
        // Get 'sampleContent' field from the request's body. 
        const someData = req.body.sampleContent;

        // Insert into the 'example' table
        const client = await pool.connect();
        await client.query('INSERT INTO example (some_data) VALUES ($1)', [someData]);
        // Release client back into connection pool.
        client.release(); 
    
        res.status(201).send('Data inserted successfully');
    } catch (error) {
        console.error('Error inserting data', error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/mongodb/get', (req, res) => {
});

router.get('/mongodb/post', (req, res) => {
});

module.exports = router;