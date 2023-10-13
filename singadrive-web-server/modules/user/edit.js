
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const bcrypt = require('bcrypt');

const { Pool } = require('pg');
const postgresPool = new Pool({
    host: 'localhost',
    database: process.env.POSTGRES_DB,

    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    port: 5432
});

const LogsModel = require('../../mongo_models/user/logs');
const AccountsModel = require('../../mongo_models/user/accounts');
const mongoConfig = {
    url: `mongodb://127.0.0.1:27017/${process.env.MONGODB_DB}`,
    dbName: `${process.env.MONGODB_DB}`
};

router.post("/get-data", async (req, res) => {

  const sessionToken = req.body.session_token;
  const browserInfo = req.body.browser_info;
  try {
    let resultObj = {};
    const client = await postgresPool.connect();

    // Check if session token is valid,
    // and fetch related user information from it...
    const query = 'SELECT * FROM "user".check_session_token($1, $2);';
    const result = await client.query(query, [sessionToken, browserInfo]);
    if (result.rows.length > 0) {
      resultObj = result.rows[0];
      
      if (resultObj.message === 'INVALID') {
        res.status(400).send('INVALID');
        client.release();
        return;
      } else if (resultObj.message === 'BROWSER') {
        res.status(500).send('ERROR');
        client.release();
        console.log("One of the user's account was attempted to be logged in by session token, but browser mismatch!")
        return;
      } else if (resultObj.message === 'EXPIRED') {
        res.status(400).send('EXPIRED');
        client.release();
        return;
      }
    }

    // Get all session token related to the user...
    const sessionTokensQuery = 'SELECT * FROM "user".get_session_tokens($1, $2);';
    const sessionTokensResult = await client.query(sessionTokensQuery, [sessionToken, browserInfo]);
    resultObj.session_tokens = sessionTokensResult.rows;
    client.release(); 

    await mongoose.connect(mongoConfig.url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    // Get description, birthday and external links from MongoDB
    const accountData = await AccountsModel.findOne({ id: resultObj.account_id });
    if (accountData) {
      resultObj.description = accountData.description;
      resultObj.birthday = accountData.birthday;
      resultObj.external_links = accountData.external_links;
    }

    res.status(200).json(resultObj); 
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).send('Internal Server Error');
  } finally {
    mongoose.connection.close();
  }
});

module.exports = router;
