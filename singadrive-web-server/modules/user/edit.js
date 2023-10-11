
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const bcrypt = require('bcrypt');
const { Pool } = require('pg');

const AccountsModel = require('../mongo_models/user/accounts');
const LogsModel = require('../mongo_models/user/logs');

const mongoConfig = {
    url: `mongodb://127.0.0.1:27017/${process.env.MONGODB_DB}`,
    dbName: `${process.env.MONGODB_DB}`
};

const postgresPool = new Pool({
    host: 'localhost',
    database: process.env.POSTGRES_DB,

    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    port: 5432
});

router.post("/get-data", async (req, res) => {
  // TODO: Get all user related data that can be edited....
});

module.exports = router;
