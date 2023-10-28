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

const AccountsModel = require('../../mongo_models/user/accounts');
const mongoConfig = {
    url: `mongodb://127.0.0.1:27017/${process.env.MONGODB_DB}`,
    dbName: `${process.env.MONGODB_DB}`
};

router.get('/profile', async (req, res) => {
  console.log(req.query);
  const username = req.query.username;

  try {
    // Fetch userdata from PostgreSQL
    const client = await postgresPool.connect();
    const query = 'SELECT * FROM "user"."public_accounts_info" WHERE username = $1';
    const { rows } = await client.query(query, [username]);

    let resultData = {};
    if (rows.length === 0) {
      client.release();
      res.status(404).json({ message: 'NOT FOUND' });
      return;
    }
    resultData = rows[0];
    client.release();

    // From mongoose...
    await mongoose.connect(mongoConfig.url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    let accountData = await AccountsModel.findOne(
      { id: resultObj.account_id }
    );
    resultData.birthday = accountData.birthday;
    resultData.description = accountData.description;
    resultData.externalLinks = accountData.external_links;

    res.status(404).json({ message: 'SUCCESS', data: resultData });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  } finally {
    mongoose.connection.close();
  }
});

module.exports = router;
