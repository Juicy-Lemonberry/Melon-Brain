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

const PostContentModel = require('../../mongo_models/forum/postContentModel');
const mongoConfig = {
    url: `mongodb://127.0.0.1:27017/${process.env.MONGODB_DB}`,
    dbName: `${process.env.MONGODB_DB}`
};

router.get("/get-tags", async (req, res) => {
    try {
        const client = await postgresPool.connect();
        let query = `SELECT * FROM "forum"."tags";`;

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

//#region Create New Post

async function insertNewPostRow(sessionToken, categoryID, tagsID) {
    const client = await postgresPool.connect();
    const query = `SELECT * FROM "forum"."create_new_post"($1, $2, $3);`;
    const queryResult = await client.query(query, [sessionToken, categoryID, tagsID]);
    const result = queryResult.rows[0];
    client.release();
    return result;
}

async function createNewPostDocument(postID, postTitle, postContent) {
    await PostContentModel.create({
        id: postID,
        title: postTitle,
        content: postContent
    });
}

router.post("/create-post", async (req, res) => {
    const sessionToken = req.body.session_token;
    const tagsID = req.body.tags_id;
    const postTitle = req.body.post_title;
    const postContent = req.body.post_content;
    const categoryID = req.body.category_id;

    if ([sessionToken, tagsID, postTitle, postContent, categoryID].some(item => item == null)) {
        res.status(400).send({ message: 'MISSING FIELDS' });
        return;
    }      

    try {
        const insertResult = await insertNewPostRow(sessionToken, categoryID, tagsID);
        console.log(insertResult);
        const message = insertResult.message;
        const postID = insertResult.post_id;

        if (message != "SUCCESS" ){
            // TODO: More constructive error messages...
            res.status(500).json({ message: 'Internal Server Error' });
            return;
        }

        await createNewPostDocument(postID, postTitle, postContent);
        res.status(200).json({ post_id: postID});
    } catch (error) {
        console.error('Error creating post...', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

//#endregion

//#region Fetch Posts

const PostInformation = require('../../models/postInformation');

async function fetchPostFromPostgreSQL(postID) {
    const client = await postgresPool.connect();
    const query = `SELECT * FROM "forum"."get_post_details"($1);`;
    const queryResult = await client.query(query, [postID]);
    client.release();

    if (queryResult.rows.length <= 0) {
        return null;
    }

    return queryResult.rows[0];
}

async function fetchPostContent(postID) {
    const result = await PostContentModel.findOne({
        id: postID
    });
    
    return result;
}

router.post("/get-post", async (req, res) => {
    const postID = req.body.post_id;

    if (postID == null){
        res.status(400).send({ message: 'MISSING FIELDS' });
        return;
    }

    try {
        const queryResult = await fetchPostFromPostgreSQL(postID);
        if (queryResult == null){
            res.status(500).json({ message: 'Internal Server Error' });
            return;
        }

        const postInformation = new PostInformation(
            postID, 
            queryResult.category_id,
            queryResult.username,
            queryResult.display_name,
            queryResult.tags,
            queryResult.created_at
        );

        const postContent = await fetchPostContent(postID);
        postInformation.populatePost(postContent.title, postContent.content);
        
        res.status(200).json(postInformation.toDictionaryObject());
    } catch (error) {
        console.log("Error occured trying to fetch post.\n", error)
        res.status(500).json({ message: 'Internal Server Error' });
    }
})

//#endregion

module.exports = router;