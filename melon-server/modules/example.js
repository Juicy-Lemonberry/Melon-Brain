const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const { Pool } = require('pg');

// Create a PostgreSQL connection pool
const postgresPool = new Pool({
    host: 'localhost',
    database: process.env.POSTGRES_DB,
    
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    port: 5432, 
});

const mongoConfig = {
    url: `mongodb://127.0.0.1:27017/${process.env.MONGODB_DB}`,
    dbName: `${process.env.MONGODB_DB}`
};

router.get('/postgres', async (req, res) => {
    try {
        const client = await postgresPool.connect();
        const result = await client.query('SELECT some_data FROM example');
    
        // Extract the 'some_data' columns and store them in an array
        const someDataArray = result.rows.map(row => 
        {
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
router.post('/postgres', async (req, res) => {
    try {
        // Get 'sampleContent' field from the request's body. 
        const someData = req.body.sampleContent;

        // Insert into the 'example' table
        const client = await postgresPool.connect();
        await client.query('INSERT INTO example (some_data) VALUES ($1)', [someData]);
        // Release client back into connection pool.
        client.release(); 
    
        res.status(201).send('Data inserted successfully');
    } catch (error) {
        console.error('Error inserting data', error);
        res.status(500).send('Internal Server Error');
    }
});

const exampleSchema = new mongoose.Schema({
    sampleContent: String
});

const ExampleModel = mongoose.model('Example', exampleSchema);

// Or instead of sharing the same API route,
// you can seperate into different API routes for get/post...
router.get('/mongodb/get', async (req, res) => {
    try {
        console.log(mongoConfig.url);
        // Connect to MongoDB using Mongoose
        await mongoose.connect(mongoConfig.url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        // Query the "example" collection using the Mongoose model
        const documents = await ExampleModel.find({});

        console.log(documents);
        res.json({ result: documents });
    } catch (error) {
        console.error('Error: ', error);
        res.status(500).send('Internal Server Error');
    } finally {
        // Close the Mongoose connection
        mongoose.connection.close();
    }
});

router.post('/mongodb/post', async (req, res) => {
    try {
        // Connect to MongoDB using Mongoose
        await mongoose.connect(mongoConfig.url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        // Create a new document using the example model
        const newDocument = new ExampleModel({
            sampleContent: req.body.sampleContent,
        });

        // Save the new document to the "example" collection
        await newDocument.save();

        res.status(201).send('Data inserted successfully');
    } catch (error) {
        console.error('Error: ', error);
        res.status(500).send('Internal Server Error');
    } finally {
        // Close the Mongoose connection
        mongoose.connection.close();
    }
});
  
module.exports = router;