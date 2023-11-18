const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const postgresPool = require("../../configs/postgresPool");
const mongoConfig = require("../../configs/mongoConfig");

//#region Create Comment
const CommentContentModel = require('../../mongo_models/forum/commentContentModel');

async function createCommentPostgreSQL(postID, sessionToken, browserInfo) {
    const client = await postgresPool.connect();
    let query = `SELECT * FROM "forum"."create_new_comment"($1, $2, $3)`;
    const queryResult = await client.query(query, [postID, sessionToken, browserInfo]);
    
    const result = queryResult.rows[0];
    client.release();

    if (result.message != "OK"){
        return null;
    }

    return result.comment_id;
}

async function storeCommentContent(commentID, content, parentContentID) {
    await mongoose.connect(mongoConfig.url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    await CommentContentModel.create({
        id: commentID,
        content: content,
        parent_comment_id: parentContentID
    });
    
    mongoose.connection.close();
}

router.post("/create-comment", async (req, res) => {
    const sessionToken = req.body.session_token;
    const postID = req.body.post_id;
    const content = req.body.content;
    const browserInfo = req.body.browser_info;

    // NOTE: Optional, only if this post was under a comment
    const parentContentID = req.body.parent_comment_id;

    if ([sessionToken, postID, content, browserInfo].some(item => item == null)) {
        res.status(400).send({ message: 'MISSING FIELDS' });
        return;
    }

    try {
        const commentID = await createCommentPostgreSQL(postID, sessionToken, browserInfo);
        if (commentID == null) {
            res.status(500).json({ message: 'Internal Server Error' });
            return;
        }

        await storeCommentContent(commentID, content, parentContentID);
        res.status(200).json({ commentID: commentID });
    } catch (error) {
        console.log("Error occured trying to fetch posts in category.\n", error)
        res.status(500).json({ message: 'Internal Server Error' });
    } finally {
        if (mongoose.connection.readyState) {
            mongoose.connection.close();
        }
    }
});
//#endregion

module.exports = router;