// Anything related to users
// (Registration, Login, etc)

const express = require('express');
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

function _isValidUsername(username) {
    const usernameRegex = /^[A-Za-z0-9]+$/;
    if (!username) {
        return false;
    }
    return usernameRegex.test(username);
}

function _isValidPassword(password) {
    const passwordRegex = /^[A-Za-z0-9!@#$%^&*()_+{}\[\]:;<>,.?~\\-]+$/;
    if (!password) {
        return false;
    }
    return passwordRegex.test(password);
}

function _isValidEmail(email) {
    const emailRegex = /^[A-Za-z0-9+_.-]+@(.+)$/;
    if (!email) {
        return false;
    }    
    return emailRegex.test(email);

    // TODO: Check if email actually exists in SMTP server.
}

router.post('/register', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const username = req.body.username;

    // Perform the same validation as client-side
    // NOTE: Since the validation should done on the client-side,
    // just keep the error messages generic.
    if (!_isValidUsername(username)) {
        res.status(400).send('Invalid username');
        return;
    }
    
    if (!_isValidPassword(password)) {
        res.status(400).send('Invalid password');
        return;
    }

    if (!_isValidEmail(email)) {
        res.status(400).send('Invalid email');
        return;
    }

    try {
        const client = await postgresPool.connect();
        const result = await client.query('SELECT * FROM "user"."accounts" WHERE username = $1', [username]);

        // If there is a user with the same username,
        // return an error.
        if (result.rows.length > 0) {
            res.status(400).send('Sorry, username already exists!');
            return;
        }

        bcrypt.hash(password, 10).then(async function(hashedPassword) {
            const insertResult = await client.query('INSERT INTO "user"."accounts" (username, email, hashed_password) VALUES ($1, $2, $3)', [username, email, hashedPassword]);
            client.release();
            if (insertResult.rowCount !== 1) {
                res.status(500).send('Internal Server Error, contact admin or try again later...');
                return;
            }
            res.status(201).send('User created successfully');
        });
       
    } catch (error) {
        console.error('Error inserting data', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;