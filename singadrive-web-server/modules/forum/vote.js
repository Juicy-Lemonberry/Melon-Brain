const express = require('express');
const router = express.Router();

const VoteModel = require('../../mongo_models/forum/voteModel');

//#region Create Vote

async function createVote(contentID, accountID, voteValue, contentType) {
    await VoteModel.create({
        account_id: accountID,
        content_id: contentID,
        vote_content: contentType,
        vote_value: voteValue
    });
};

router.post("/create-vote", async (req, res) => {
    const voteValue = req.body.vote_value;
    const contentType = req.body.content_type;
    const contentID = req.body.content_id;
    const accountID = req.body.account_id;

    if ([voteValue, contentType, contentID, accountID].some(item => item == null)) {
        res.status(400).send({ message: 'MISSING FIELDS' });
        return;
    } 

    try {
        await createVote(contentID, accountID, voteValue, contentType);
        res.status(200).json({ message: 'SUCCESS' });
    }  catch (error) {
        console.error('Error creating vote...', error);
        res.status(500).json({ message: 'Internal Server Error' });
    } 
});
//#endregion

//#region Get Content Vote Count
async function getNetVoteCount(contentID, contentType) {
    const results = await VoteModel.find({
        content_id: contentID,
        vote_content: contentType
    });

    let upvoteCount = 0;
    let downvoteCount = 0;
    results.forEach(result => {
        if (result.vote_value === 'UPVOTE') {
            upvoteCount += 1;
        } else if (result.vote_value === 'DOWNVOTE') {
            downvoteCount += 1;
        }
    });

    const netVoteCount = upvoteCount - downvoteCount;
    return netVoteCount;
}

router.post("/get-content-vote-count", async (req, res) => {
    const contentType = req.body.content_type;
    const contentID = req.body.content_id;

    if ([contentType, contentID].some(item => item == null)) {
        res.status(400).send({ message: 'MISSING FIELDS' });
        return;
    } 

    try {
        const count = await getNetVoteCount(contentID, contentType);

        res.status(200).json({ count: count });
    }  catch (error) {
        console.error('Error getting vote count...', error);
        res.status(500).json({ message: 'Internal Server Error' });
    } 
});
//#endregion

//#region Check User Voted on Content
async function getAccountContentVote(accountID, contentID, contentType) {
    const result = await VoteModel.find({
        account_id: accountID,
        content_id: contentID,
        vote_content: contentType
    });

    if (result.length <= 0){
        return null;
    }

    return result[0].vote_value ? result[0].vote_value : null;
}

router.post("/check-user-content-vote", async (req, res) => {
    const contentType = req.body.content_type;
    const contentID = req.body.content_id;
    const accountID = req.body.account_id;

    if ([contentType, contentID, accountID].some(item => item == null)) {
        res.status(400).send({ message: 'MISSING FIELDS' });
        return;
    } 

    try {
        const voteValue = await getAccountContentVote(accountID, contentID, contentType);
        res.status(200).json({ value: voteValue });
    }  catch (error) {
        console.error('Error checking user vote...', error);
        res.status(500).json({ message: 'Internal Server Error' });
    } 
});
//#endregion

module.exports = router;