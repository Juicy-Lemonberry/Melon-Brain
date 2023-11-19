const express = require('express');
const router = express.Router();

const postgresPool = require('../../configs/postgresPool');

const PostContentModel = require('../../mongo_models/forum/postContentModel');
const CommentContentModel = require('../../mongo_models/forum/commentContentModel');

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

//#region Edit Post

async function updatePostContent(postID, newContent) {
    await PostContentModel.findOneAndUpdate(
        { id: postID }, 
        { content: newContent }
    );
}

async function checkIfUserPost(sessionToken, browserInfo, postID) {
    const client = await postgresPool.connect();
    const query = `SELECT * FROM "forum"."is_user_post"($1, $2, $3);`;
    const queryResult = await client.query(query, [sessionToken, browserInfo, postID]);
    client.release();

    if (queryResult.rows.length <= 0) {
        return null;
    }

    return queryResult.rows[0];
}

router.post("/edit-post", async (req, res) => {
    const sessionToken = req.body.session_token;
    const browserInfo = req.body.browser_info;
    const postID = req.body.post_id;
    const newContent = req.body.new_content;

    if ([sessionToken, browserInfo, postID, newContent].some(item => item == null)) {
        res.status(400).send({ message: 'MISSING FIELDS' });
        return;
    }      

    try {
        const checkResult = await checkIfUserPost(sessionToken, browserInfo, postID);
        if (!checkResult.is_user) {
            // TODO: Return more information...
            res.status(400).send({ message: 'INVALID USER' });
            return;
        }

        await updatePostContent(postID, newContent);
        res.status(200).send({ message: 'SUCCESS' });
    } catch (error) {
        console.error('Error updating post...', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
//#endregion

//#region Delete Post

async function deletePost(sessionToken, browserInfo, postID) {
    const client = await postgresPool.connect();
    const query = `SELECT * FROM "forum"."delete_post"($1, $2, $3);`;
    const queryResult = await client.query(query, [sessionToken, browserInfo, postID]);
    client.release();

    if (queryResult.rows.length <= 0) {
        return null;
    }

    return queryResult.rows[0];
}

async function deleteAllComments(comments) {
    let deleteRequests = [];
    for (let i = 0; i < comments.length; ++i) {
        const currentID = comments[i].comment_id;

        deleteRequests.push(
            CommentContentModel.deleteMany({
                id: currentID
            })
        );
    }

    await Promise.all(deleteRequests);
}

async function getPostComments(postID) {
    const client = await postgresPool.connect();
    let query = `SELECT * FROM "forum"."get_post_comments"($1)`;
    const queryResult = await client.query(query, [postID]);
    
    const result = queryResult.rows;
    client.release();

    return result;
}

router.post("/delete-post", async (req, res) => {
    const sessionToken = req.body.session_token;
    const browserInfo = req.body.browser_info;
    const postID = req.body.post_id;

    if ([sessionToken, browserInfo, postID].some(item => item == null)) {
        res.status(400).send({ message: 'MISSING FIELDS' });
        return;
    }      

    try {
        const checkResult = await checkIfUserPost(sessionToken, browserInfo, postID);
        if (!checkResult.is_user) {
            // TODO: Return more information...
            res.status(400).send({ message: 'INVALID USER' });
            return;
        }

        const postComments = await getPostComments(postID);
        await Promise.all([
            deleteAllComments(postComments),
            deletePost(sessionToken, browserInfo, postID)
        ]);

        res.status(200).send({ message: 'SUCCESS' });
    } catch (error) {
        console.error('Error updating post...', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
//#endregion

module.exports = router;