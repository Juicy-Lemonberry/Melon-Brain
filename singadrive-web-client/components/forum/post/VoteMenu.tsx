'use client'
import config from '@/config';
import React, { useState, FC, useEffect } from 'react';
import { Button } from 'react-bootstrap';

enum VotingStatus {
    None,
    DownVoted,
    UpVoted,
    Failure
}

enum ContentType {
    Post = "POST",
    Comment = "COMMENT"
}

enum VoteValue {
    Upvote = "UPVOTE",
    Downvote = "DOWNVOTE"
}

interface VoteMenuProps {
    contentType: ContentType | string;
    contentID: string;
    accountID: string | null;
}

async function getTotalVotes(contentType: string, contentID: string): Promise<string> {
    console.log(`Getting total votes for ${contentType} with ${contentID}`);
    
    const jsonData = {
        "content_id": contentID,
        "content_type": contentType
    };

    const options = {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(jsonData)
    };


    const endpointUrl = `${config.API_BASE_URL}/api/forum-vote/get-content-vote-count`;
    const response = await fetch(endpointUrl, options);
    const data = await response.json();

    if (!response.ok) {
        // TODO: Better error handling...
        return "0";
    }

    return data["count"];
}

async function getUserVotedState(contentType: string, contentID: string, accountID: string | null): Promise<string | null> {
    if (accountID == null){
        return null;
    }
    
    const jsonData = {
        "content_id": contentID,
        "account_id": accountID,
        "content_type": contentType
    };

    const options = {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(jsonData)
    };


    const endpointUrl = `${config.API_BASE_URL}/api/forum-vote/check-user-content-vote`;
    const response = await fetch(endpointUrl, options);
    const data = await response.json();

    if (!response.ok) {
        return null;
    }

    return data["value"];
}

async function handleVote(contentType: string, contentID: string, accountID: string | null, voteValue: VoteValue): Promise<VotingStatus> {
    if (accountID == null){
        return VotingStatus.Failure;
    }   

    const jsonData = {
        "content_id": contentID,
        "account_id": accountID,
        "content_type": contentType,
        "vote_value": voteValue
    };

    const options = {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(jsonData)
    };


    const endpointUrl = `${config.API_BASE_URL}/api/forum-vote/create-vote`;
    const response = await fetch(endpointUrl, options);
    if (!response.ok) {
        return VotingStatus.Failure;
    }

    if (voteValue == VoteValue.Downvote) {
        return VotingStatus.DownVoted;
    } else {
        return VotingStatus.UpVoted;
    }
}

function displayVotingStatus(votingStatus: VotingStatus) {
    if (votingStatus == VotingStatus.DownVoted) {
        return (<p>Successfully downvoted!</p>)
    } else if (votingStatus == VotingStatus.UpVoted) {
        return (<p>Successfully upvoted!</p>)
    } else {
        return (<p>Something went wrong! Try again later or contact admin!</p>)
    }
}

const VoteMenu: FC<VoteMenuProps> = ({ contentType, contentID, accountID }) => {
    const [voteCount, setVoteCount] = useState('0');
    const [accountVoteState, setAccountVoteState] = useState<string | null>(null);
    const [votingStatus, setVotingStaus] = useState<VotingStatus>(VotingStatus.None);

    useEffect(() => {
        getTotalVotes(contentType as string, contentID)
        .then((result) => setVoteCount(result))
    }, [contentID])

    useEffect(() => {
        getUserVotedState(contentType as string, contentID, accountID)
        .then((result) => setAccountVoteState(result));
    }, [accountID])

    const triggerVote = (upvote: boolean) => {
        handleVote(
            contentType as string,
            contentID,
            accountID,
            upvote ? VoteValue.Upvote : VoteValue.Downvote
        ).then((result) => setVotingStaus(result));
    }

    if (votingStatus != VotingStatus.None) {
        return (
            <div>
                {displayVotingStatus(votingStatus)}
                <span className="ml-2 mr-2">Votes: {voteCount}</span>
            </div>
        )
    }

    if (accountID == null){
        return (
            <div>
                <p>Login to vote</p>
                <span className="ml-2 mr-2">Votes: {voteCount}</span>
            </div>
        );
    }

    if (accountVoteState == null) {
        return (
            <div>
                <Button variant="success" className="m-1" onClick={() => triggerVote(true)}>Upvote</Button>
                <span className="ml-2 mr-2">Votes: {voteCount}</span>
                <Button variant="danger" className="m-1" onClick={() => triggerVote(false)}>Downvote</Button>
            </div>
        );
    }

    return (
        <div>
            <p>You have {accountVoteState.toLocaleLowerCase()}d this.</p>
            <span className="ml-2 mr-2">Votes: {voteCount}</span>
        </div>
    );
};

export default VoteMenu;
