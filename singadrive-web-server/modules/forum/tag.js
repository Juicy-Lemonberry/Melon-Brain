const express = require('express');
const router = express.Router();

const postgresPool = require("../../configs/postgresPool");

//#region Get Tag
router.post("/get-tag", async (req, res) => {
    const tagTitle = req.body.tag_title;

    if (tagTitle == null) {
        res.status(400).send({ message: 'MISSING FIELDS' });
        return;
    }      

    try {
        const client = await postgresPool.connect();
        const query = `SELECT * FROM "forum"."tags" WHERE name = $1;`;
        const queryResult = await client.query(query, [tagTitle]);
        client.release();

        if (queryResult.rows.length <= 0) {
            res.status(400).json({message: 'UNKNOWN TAG' });
            return;
        }
    
        res.status(200).json(queryResult.rows[0]);
    } catch (error) {
        console.error('Error updating post...', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
//#endregion

module.exports = router;