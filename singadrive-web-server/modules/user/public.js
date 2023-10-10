const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

const postgresPool = new Pool({
    host: 'localhost',
    database: process.env.POSTGRES_DB,

    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    port: 5432
});

router.get('/profile', async (req, res) => {
  console.log(req.query);
  const username = req.query.username;

  try {
    const client = await postgresPool.connect();
    const query = 'SELECT * FROM "user"."public_accounts_info" WHERE username = $1';
    const { rows } = await client.query(query, [username]);

    if (rows.length === 0) {
      res.status(404).json({ message: 'NOT FOUND' });
    } else {
      res.status(200).json({ message: 'SUCCESS', data: rows[0] });
    }

    client.release();
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
