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

const PostContentModel = require('../../mongo_models/forum/postContentModel');
const mongoConfig = {
    url: `mongodb://127.0.0.1:27017/${process.env.MONGODB_DB}`,
    dbName: `${process.env.MONGODB_DB}`
};

router.get("/get-categories", async (req, res) => {
    try {
        const client = await postgresPool.connect();
        let query = `SELECT * FROM "forum"."section_categories";`;

        const { rows } = await client.query(query);
        if (rows.length <= 0) {
            // NOTE: Should always have rows.
            res.status(500).json({ message: "Internal Server Error" });
        } else {
            res.status(200).json(rows);
        }
        client.release();
    } catch (error) {
        console.error('Error fetching all categories.', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

//#region Get Category Posts

const MiniPostInformation = require('../../models/miniPostInformation');

async function fetchPostsPostgreSQL(categoryID){
    const client = await postgresPool.connect();
    let query = `SELECT * FROM "forum"."get_category_posts"($1);`;
    const queryResult = await client.query(query, [categoryID]);
    client.release();

    if (queryResult.rows.length <= 0) {
        return [];
    }

    return queryResult.rows;
}

async function fetchPostContents(postID){
    const result = await PostContentModel.findOne({
        id: postID
    });

    return result;
}

function trimPostContent(content) {
    // NOTE: Always make sure its below certain number of chars
    // if was originally more than some characters,
    // replace the last 3 characters to '...'.
    const targetCharacterCount = 40;
    if (content.length > targetCharacterCount) {
        return content.substring(0, targetCharacterCount - 3) + '...';
    }
    return content;
}

router.post("/get-posts", async (req , res) => {
    const categoryID = req.body.category_id;
    if (categoryID == null){
        res.status(400).send({ message: 'MISSING FIELDS' });
        return;
    }

    try {
        await mongoose.connect(mongoConfig.url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        let miniPosts = []

        // Create mini-post information for each row...
        const rowResults = await fetchPostsPostgreSQL(categoryID);
        for (let i = 0; i < rowResults.length; ++i){
            const currentRow = rowResults[i];
            const postID = currentRow.post_id;
            const currentPost = new MiniPostInformation(
                postID,
                currentRow.display_name,
                currentRow.tags,
                currentRow.created_at,
                currentRow.last_activity
            );

            const postContent = await fetchPostContents(postID);
            if (postContent == null){
                // TODO: Handling or better logging...
                console.log(`Post ID of ${postID} is empty at MongoDB!!`);
                continue;
            }
            currentPost.populatePost(postContent.title, trimPostContent(postContent.content));

            miniPosts.push(currentPost.toDictionaryObject());
        }

        res.status(200).json({"posts": miniPosts});
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