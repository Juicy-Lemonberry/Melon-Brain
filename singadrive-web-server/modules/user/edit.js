
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
        res.status(400).json({ message: 'INVALID' });
        client.release();
        return;
      } else if (resultObj.message === 'BROWSER') {
        res.status(500).json({ message: 'ERROR' });
        client.release();
        console.log("One of the user's account was attempted to be logged in by session token, but browser mismatch!")
        return;
      } else if (resultObj.message === 'EXPIRED') {
        res.status(400).json({ message: 'EXPIRED' });
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
    let accountData = await AccountsModel.findOne(
      { id: resultObj.account_id }
    );
    
    if (!accountData) {
      accountData = await AccountsModel.create({
        id: resultObj.account_id
      });
    }    

    resultObj.description = accountData.description;
    resultObj.birthday = accountData.birthday;
    resultObj.external_links = accountData.external_links;
    
    res.status(200).json(resultObj); 
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).json({ message: 'Internal Server Error' });
  } finally {
    mongoose.connection.close();
  }
});

//#region Update Data Utils

async function _verifyAndUpdateCredentials(client, sessionToken, browserInfo, accountInfo) {
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

async function _handleSensitiveInfoUpdate(req, res, client, accountInfo) {
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
    if (resultObj.message === 'NOT FOUND') {
      return { status: 400, message: "USER NOT FOUND" };
    } else if (resultObj.hashed_password === null) {
      return { status: 500, message: "ERROR" };
    }
  }

  const hashedPassword = resultObj.hashed_password.toString('utf8');
  const isPasswordCorrect = await bcrypt.compare(verificationPassword, hashedPassword);
  if (!isPasswordCorrect) {
    return { status: 400, message: 'INVALID PASSWORD VERIFICATION' };
  }

  // Check what the user wants to change is valid
  // email/password is optional...
  // PostgreSQL function will retain old value in column if null is given...
  if (req.body.email){
    // Check if email format is valid...
    const inputEmail = req.body.email;
    if (!_isValidEmail(inputEmail)) {
      return { status: 400, message: "INVALID INPUT EMAIL" };
    }
    accountInfo.email = inputEmail;
  }
  
  if (req.body.password) {
    // Check if password format is valid, then hash it.
    const inputPassword = req.body.password;
    if (!_isValidPassword(inputPassword)) {
      return { status: 400, message: "INVALID INPUT PASSWORD" };
    }

    accountInfo.hashed_password = await bcrypt.hash(inputPassword, 10);
  }

  return await _verifyAndUpdateCredentials(client, req.body.session_token, req.body.browser_info, accountInfo);
}

async function _handleAccountInfoUpdate(req, res, client, accountInfo) {
  const updateQuery = 'SELECT * FROM "user".update_account_details($1, $2, $3);';
  const updateResult = await client.query(updateQuery, [req.body.session_token, req.body.browser_info, accountInfo.display_name]);
  
  let resultObj = {};
  if (updateResult.rows.length > 0) {
    resultObj = updateResult.rows[0];
    if (resultObj.message !== 'OK') {
      return { status: 400, message: resultObj.message };
    }
  }

  return { status: 200, message: resultObj.message };
}
//#endregion

router.post("/update-data", async (req, res) => {
  const sessionToken = req.body.session_token;
  const browserInfo = req.body.browser_info;
  if (!sessionToken || !browserInfo) {
    res.status(400).json({ message: 'BODY FIELD' });
    return;
  }

  try {
    const client = await postgresPool.connect();
    const accountInfo = new AccountInformation();
  
    let sensitiveInformationChanged = false;
    accountInfo.display_name = req.body.display_name ?? '';
    accountInfo.description = req.body.description ?? '';
    accountInfo.birthday = req.body.birthday ?? null;
    // Remoe all empty/nulls fields from external links...
    accountInfo.external_links = req.body.external_links ?? [];
    accountInfo.external_links = accountInfo.external_links.filter((link) => {
      return link.title && link.url && link.title.trim() !== '' && link.url.trim() !== '';
    });
    accountInfo.birthday = req.body.birthday ?? null;

    let result = {};
    // Update sensitive information, if user gave any to update.
    if (req.body.password || req.body.email) {
      result = await _handleSensitiveInfoUpdate(req, res, client, accountInfo);
      if (result.status !== 200) {
        res.status(result.status).json({ message: result.message });
        return;
      }
      sensitiveInformationChanged = true;
    }

    // Update non-sesntitive info on PostgreSQL.
    result = await _handleAccountInfoUpdate(req, res, client, accountInfo);
    if (result.status !== 200) {
      res.status(result.status).json({ message: result.message });
      return;
    }
    
    // Find userI (for MongoDB)
    let userID = null;
    const query = 'SELECT * FROM "user".check_session_token($1, $2);';
    result = await client.query(query, [sessionToken, browserInfo]);
    if (result.rows.length > 0) {
      let resultObj = result.rows[0];
      
      if (resultObj.message === 'INVALID') {
        res.status(400).json({ message: 'INVALID' });
        client.release();
        return;
      } else if (resultObj.message === 'BROWSER') {
        res.status(500).json({ message: 'ERROR' });
        client.release();
        console.log("One of the user's account was attempted to be logged in by session token, but browser mismatch!")
        return;
      } else if (resultObj.message === 'EXPIRED') {
        res.status(400).json({ message: 'EXPIRED' });
        client.release();
        return;
      }

      userID = resultObj.account_id;
    }
    client.release();

    await mongoose.connect(mongoConfig.url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await AccountsModel.findOneAndUpdate(
      { id: userID },
      {
        $set: {
          description: accountInfo.description,
          birthday: accountInfo.birthday,
          external_links: accountInfo.external_links
        }
      },
      {
        upsert: true // create new document if not exists...
      }
    );

    // Log information...
    let logDescription = `Changed Account Information`;
    if (sensitiveInformationChanged) {
      logDescription = `Changed Sensitive Account Information`;
    }

    await LogsModel.create(
      { 
        id: userID,
        description: logDescription,
        browser_info: browserInfo
      }
    );
    
    res.status(200).json({ message: "OK" });
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).json({ message: 'Internal Server Error' });
  } finally {
    mongoose.connection.close();
  }
});

//#region Delete Session Token Utils
async function _deleteSessionToken(sessionToken, browserInfo, deleteTarget) {
  const client = await postgresPool.connect();
  try {
    const updateQuery = 'SELECT * FROM "user".delete_session_token($1, $2, $3);';
    const updateResult = await client.query(updateQuery, [sessionToken, browserInfo, deleteTarget]);
    let result = { message: "INVALID", status: 400 };
    
    if (updateResult.rows.length > 0) {
      const resultObj = updateResult.rows[0];
      if (resultObj.message === "SUCCESS") {
        result.message = "SUCCESS";
        result.status = 200;
      } else if (resultObj.message === "BROWSER") {
        console.log(`Illegal session token usage on ${sessionToken} onto deleting ${deleteTarget}...`);
      }
    }
    return result;
  } finally {
    client.release();
  }
}

async function _logDeletion(mongoConfig, LogsModel, userID, browserInfo) {
  await mongoose.connect(mongoConfig.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  
  try {
    await LogsModel.create({
      id: userID,
      description: `Deleted session token related to ${browserInfo}`,
      browser_info: browserInfo
    });
  } finally {
    mongoose.connection.close();
  }
}

async function _getUserID(username) {
  const client = await postgresPool.connect();
  try {
    const query = 'SELECT id FROM "user"."public_accounts_info" WHERE username = $1';
    const { rows } = await client.query(query, [username]);
    if (rows.length > 0) {
      return rows[0].id; // Assuming 'id' is the column name for the user ID
    }
    return null; // Return null if the user is not found
  } finally {
    client.release();
  }
}
//#endregion

router.post("/delete-token", async (req, res) => {
  const {
    username: username,
    session_token: sessionToken,
    browser_info: browserInfo,
    delete_token: deleteTarget
  } = req.body;

  try {
    const deletionResult = await _deleteSessionToken(sessionToken, browserInfo, deleteTarget);
    if (deletionResult.status === 200) {
      const userID = _getUserID(username);

      if (userID == null){
        console.log(`Failed to log the deletion of a session token related to user ${userID}!`)
      } else {
        await _logDeletion(mongoConfig, LogsModel, userID, browserInfo);
      }
    }

    res.status(deletionResult.status).json({ message: deletionResult.message });
  } catch (error) {
    console.error('Error executing delete-token.', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
