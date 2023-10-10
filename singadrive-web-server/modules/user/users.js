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
        
        const query = 'SELECT "user".check_user_availability($1, $2) AS message;';
        const result = await client.query(query, [username, email]);
        
        // If there is a user with the same username,
        // return an error.
        if (result.rows.length > 0) {
            const message = result.rows[0].message;
            if (message === 'EMAIL' || message === 'USERNAME') {
                res.status(400).send(message);
                client.release();
                return;
            }
        }

        // Hash the password, then insert the user into the database.
        bcrypt.hash(password, 10).then(async function(hashedPassword) {
            const insertResult = await client.query('INSERT INTO "user"."accounts" (username, email, hashed_password) VALUES ($1, $2, $3)', [username, email, hashedPassword]);
            client.release();
            if (insertResult.rowCount !== 1) {
                res.status(500).send('ERROR');
                return;
            }
            res.status(201).send('SUCCESS');
        });
       
    } catch (error) {
        console.error('Error inserting data', error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/login', async (req, res) => {
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

    try {
        const client = await postgresPool.connect();
        
        const query = 'SELECT * FROM "user".find_user_hashed_password($1);';
        const result = await client.query(query, [username]);
        
        // If there is no user with the same username...
        let resultObj = {};
        if (result.rows.length > 0) {
            resultObj = result.rows[0];
            if (resultObj.message === 'NOT FOUND') {
                res.status(400).send('USERNAME');
                client.release();
                return;
            } else if (resultObj.message === 'ERROR') {
                res.status(500).send('ERROR');
                client.release();
                return;
            }
        }

        const hashedPassword = resultObj.hashed_password.toString('utf8');
        const isPasswordCorrect = await bcrypt.compare(password, hashedPassword);
        if (!isPasswordCorrect) {
            res.status(400).send('INVALID PASSWORD');
            client.release();
            return;
        }

        // If everything is correct, fetch session token.
        const browserName = req.body.browser_name;
        const sessionToken = await client.query('SELECT * FROM "user".create_account_session($1, $2) AS token;', [username, browserName]); 

        res.status(200).json({ message: 'SUCCESS', token: sessionToken.rows[0].token });
        client.release();
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/authenticate', async (req, res) => {
  const sessionToken = req.body.session_token;
  const browserName = req.body.browser_name;

  try {
    const client = await postgresPool.connect();
    
    const query = 'SELECT * FROM "user".check_session_token($1, $2);';
    const result = await client.query(query, [sessionToken, browserName]);

    let resultObj = {};
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

    res.status(200).json(resultObj);
    client.release();
 
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

router.delete('/session', async (req, res) => {
  const sessionToken = req.body.session_token;

  if (!sessionToken){
    res.status(400).send('Invalid session token');
    return
  }

  try {
    const client = await postgresPool.connect();

    const queryText = 'SELECT * FROM "user".delete_session_token($1);';
    const queryValues = [sessionToken];
    const result = await client.query(queryText, queryValues);

    if (result.rows[0].message === 'OK') {
      res.status(200).send('Session token deleted successfully');
    } else {
      res.status(400).send('Invalid session token');
    }

    client.release();
    return;
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


module.exports = router;
