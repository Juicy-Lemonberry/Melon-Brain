const express = require('express');
const router = express.Router();

const postgresPool = require("../../configs/postgresPool");

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
    await CommentContentModel.create({
        id: commentID,
        content: content,
        parent_comment_id: parentContentID
    });
}

router.post("/create-comment", async (req, res) => {
    const sessionToken = req.body.session_token;
    const postID = req.body.post_id;
    const content = req.body.content;
    const browserInfo = req.body.browser_info;

    // NOTE: Optional, only if this post was under a comment
    const parentContentID = req.body.parent_comment_id;

    if ([sessionToken, postID, content, browserInfo].some(item => item == null)) {
        res.status(400).json({ message: 'MISSING FIELDS' });
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
    }
});
//#endregion

//#region Get Post's Comments

async function getPostComments(postID) {
    const client = await postgresPool.connect();
    let query = `SELECT * FROM "forum"."get_post_comments"($1)`;
    const queryResult = await client.query(query, [postID]);
    
    const result = queryResult.rows;
    client.release();

    return result;
}

async function fetchCommentData(commentIds) {
    // Fetch all comments from MongoDB based on the comment IDs
    const commentsContent = await CommentContentModel.find({
        id: { $in: commentIds }
    });

    // Build a map for quick access
    const commentContentMap = commentsContent.reduce((map, comment) => {
        map[comment.id] = comment;
        return map;
    }, {});

    return commentContentMap;
}

async function buildCommentTree(commentData, commentContentMap, parentCommentId = null) {

    const childCommentPromises = commentData
        .filter(comment => commentContentMap[comment.comment_id].parent_comment_id === parentCommentId)
        .map(async comment => {

            let childComments = await buildCommentTree(commentData, commentContentMap, comment.comment_id);
            let commentContent = commentContentMap[comment.comment_id];
            return {
                commentID: comment.comment_id,
                username: comment.username || null,
                displayName: comment.display_name || 'Deleted User',
                createdDate: comment.created_at,
                content: commentContent.content,
                children: childComments
            };
        });

    return await Promise.all(childCommentPromises);
}

router.post("/get-post-comments", async (req, res) => {
    const postID = req.body.post_id;

    if (!postID) {
        return res.status(400).json({ message: 'MISSING FIELDS' });
    }

    try {
        const commentData = await getPostComments(postID);
        if (commentData.length === 0) {
            return res.status(200).json({ comments: [] });
        }

        const commentIds = commentData.map(comment => comment.comment_id);
        const commentContentMap = await fetchCommentData(commentIds);

        const nestedComments = await buildCommentTree(commentData, commentContentMap);

        res.status(200).json({ comments: nestedComments });
    } catch (error) {
        console.error("Error occurred trying to fetch post comments.\n", error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

//#endregion

//#region Edit Comment

async function updateCommentContent(commentID, newContent) {
    await CommentContentModel.findOneAndUpdate(
        { id: commentID },
        {
            $set: {
                content: newContent
            }
        }
    );
}

async function checkIfUserComment(sessionToken, browserInfo, commentID) {
    const client = await postgresPool.connect();
    const query = `SELECT * FROM "forum"."is_user_comment"($1, $2, $3);`;
    const queryResult = await client.query(query, [sessionToken, browserInfo, commentID]);
    client.release();

    if (queryResult.rows.length <= 0) {
        return null;
    }

    return queryResult.rows[0];
}

router.post("/edit-comment", async (req, res) => {
    const sessionToken = req.body.session_token;
    const browserInfo = req.body.browser_info;
    const commentID = req.body.comment_id;
    const newContent = req.body.new_content;

    if ([sessionToken, browserInfo, commentID, newContent].some(item => item == null)) {
        res.status(400).send({ message: 'MISSING FIELDS' });
        return;
    }      

    try {
        const checkResult = await checkIfUserComment(sessionToken, browserInfo, commentID);
        if (!checkResult.is_user) {
            // TODO: Return more information...
            res.status(400).send({ message: 'INVALID USER' });
            return;
        }

        await updateCommentContent(commentID, newContent);
        res.status(200).send({ message: 'SUCCESS' });
    } catch (error) {
        console.error('Error updating post...', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
//#endregion

//#region Delete Comment

async function flagCommentDeleted(commentID) {
    await CommentContentModel.findOneAndUpdate(
        { id: commentID },
        {
            $set: {
                content: `This comment has been deleted...`,
                is_deleted: true
            }
        }
    );
}

async function removeCommentUser(sessionToken, browserInfo, commentID) {
    const client = await postgresPool.connect();
    const query = `SELECT * FROM "forum"."remove_comment_user"($1, $2, $3);`;
    const queryResult = await client.query(query, [sessionToken, browserInfo, commentID]);
    client.release();

    if (queryResult.rows.length <= 0) {
        return null;
    }

    return queryResult.rows[0];
}

async function hasChildComments(commentID) {
    const comments = await CommentContentModel.find({ parent_comment_id: commentID });
    return comments.length >= 1;
}

async function removeComment(commentID) {
    await CommentContentModel.deleteOne({
        id: commentID
    });
}

async function deleteComment(sessionToken, browserInfo, commentID) {
    const client = await postgresPool.connect();
    const query = `SELECT * FROM "forum"."delete_comment"($1, $2, $3);`;
    const queryResult = await client.query(query, [sessionToken, browserInfo, commentID]);
    client.release();

    if (queryResult.rows.length <= 0) {
        return null;
    }

    return queryResult.rows[0];
}

async function purgeComment(commentID) {
    const client = await postgresPool.connect();
    const query = `SELECT * FROM "forum"."purge_comment"($1);`;
    const queryResult = await client.query(query, [commentID]);
    client.release();

    if (queryResult.rows.length <= 0) {
        return null;
    }

    return queryResult.rows[0];
}

// NOTE: Delete all parents that have no child nodes left,
// and was flagged for deletion...
async function doHouseKeeping() {
    const deletedComments = await CommentContentModel.find({
        is_deleted: true
    });

    let deletedSomething = false;
    for (let i = 0; i < deletedComments.length; ++i) {
        const currentComment = deletedComments[i];
        const childComments = await CommentContentModel.find({
            parent_comment_id: currentComment.id
        });

        if (childComments.length <= 0){
            await Promise.all([
                CommentContentModel.deleteMany({
                    id: currentComment.id
                }),
                purgeComment(currentComment.id)
            ])
            deletedSomething = true;
        }
    }

    // Housekeep until nothing is deleted...
    if (deletedSomething) {
        await doHouseKeeping();
    }
}

router.post("/delete-comment", async (req, res) => {
    const sessionToken = req.body.session_token;
    const browserInfo = req.body.browser_info;
    const commentID = req.body.comment_id;

    if ([sessionToken, browserInfo, commentID].some(item => item == null)) {
        res.status(400).send({ message: 'MISSING FIELDS' });
        return;
    }      

    try {
        const checkResult = await checkIfUserComment(sessionToken, browserInfo, commentID);
        if (!checkResult.is_user) {
            res.status(400).send({ message: 'INVALID USER' });
            return;
        }

        const containChildComments = await hasChildComments(commentID);
        if (containChildComments) {
            await Promise.all([
                flagCommentDeleted(commentID),
                removeCommentUser(sessionToken, browserInfo, commentID)
            ]);
            res.status(200).send({ message: 'SUCCESS' });
            return;
        }
        
        await Promise.all([
            removeComment(commentID),
            deleteComment(sessionToken, browserInfo, commentID)
        ]);

        await doHouseKeeping();
        res.status(200).send({ message: 'SUCCESS' });
    } catch (error) {
        console.error('Error updating post...', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
//#endregion

module.exports = router;