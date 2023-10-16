
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

//#region UTILs
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
//#endregion

const AccountInformation = require('../../models/accountInformation');

router.post("/get-data", async (req, res) => {
  const sessionToken = req.body.session_token;
  const browserInfo = req.body.browser_info;
  if (!sessionToken || !browserInfo) {
    res.status(400).json({ message: 'BODY FIELD' });
    return;
  }

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

//#region Update Data Utils


async function verifyAndUpdateCredentials(client, sessionToken, browserInfo, accountInfo) {
  const updateCredentialsQuery = 'SELECT * FROM "user"."update_account_credentials"($1, $2, $3, $4)';
  const updateCredentialsResult = await client.query(updateCredentialsQuery, [sessionToken, browserInfo, accountInfo.hashed_password, accountInfo.email]);
  
  let resultObj = {};
  if (updateCredentialsResult.rows.length > 0) {
    resultObj = updateCredentialsResult.rows[0];
    if (resultObj.message !== 'OK') {
      return { status: 400, message: resultObj.message };
    }
  }

  return { status: 200, message: 'OK' };
}

async function handleSensitiveInfoUpdate(req, res, client, accountInfo) {
  // Check for required fields for sensitive data update
  if (!req.body.verification_password || !req.body.username) {
    return { status: 400, message: 'MISSING VERIFICATION' };
  }

  const username = req.body.username;
  const verificationPassword = req.body.verification_password;

  // Validate the user's current password
  const getCurrentHashedPasswordQuery = 'SELECT * FROM "user".find_user_hashed_password($1)';
  const hashedPasswordResult = await client.query(getCurrentHashedPasswordQuery, [username]);

  let resultObj = {};
  if (hashedPasswordResult.rows.length > 0) {
    resultObj = hashedPasswordResult.rows[0];
    if (resultObj.message !== 'OK') {
      return { status: 400, message: resultObj.message };
    }
  }

  const hashedPassword = resultObj.hashed_password.toString('utf8');
  const isPasswordCorrect = await bcrypt.compare(verificationPassword, hashedPassword);
  if (!isPasswordCorrect) {
    return { status: 400, message: 'INVALID PASSWORD VERIFICATION' };
  }

  return await verifyAndUpdateCredentials(client, req.body.session_token, req.body.browser_info, accountInfo);
}
//#endregion

router.post("/update-data", async (req, res) => {
  const client = await postgresPool.connect();
  const accountInfo = new AccountInformation();

  try {
    accountInfo.display_name = req.body.display_name ?? '';
    accountInfo.description = req.body.description ?? '';
    accountInfo.external_links = req.body.external_links ?? [];

    let result;
    if (req.body.password || req.body.email) {
      result = await handleSensitiveInfoUpdate(req, res, client, accountInfo);
      if (result.status !== 200) {
        res.status(result.status).json({ message: result.message });
        return;
      }
    }

    // TODO: Update non-sensitive info on PostgreSQL and MongoDB...

    res.status(200).json({ message: "OK" });
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).send('Internal Server Error');
  } finally {
    client.release();
  }
});

module.exports = router;
