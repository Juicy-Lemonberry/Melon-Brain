'use client'
import React, { useEffect, useState } from 'react';
import TopNavbar from '@/components/TopNavbar';
import { useSearchParams } from 'next/navigation';
import { Container, Row, Col, ListGroup } from 'react-bootstrap';
import CommentItem from '@/components/forum/post/CommentItem';
import PostContent from '@/components/forum/post/PostContent';
import UAParser from 'ua-parser-js';
import { getSessionToken } from '@/utils/accountSessionCookie';
import config from '@/config';
import CommentForm from '@/components/forum/post/CommentForm';

async function checkUserAuthentication(): Promise<boolean> {
    const parser = new UAParser();
    const browserName = parser.getBrowser().name;
    const sessionToken = getSessionToken();

    const jsonData = {
        "browser_name": browserName,
        "session_token": sessionToken
    };

    const options = {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(jsonData)
    };

    const endpointUrl = `${config.API_BASE_URL}/api/users/authenticate`;
    const response = await fetch(endpointUrl, options);
    const data = await response.json();

    if (response.ok && data["message"] === "OK") {
        return true;
    }
    return false;
}

const PostPage = () => {
    const [newComment, setNewComment] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const searchParams = useSearchParams();
    // TODO: Invalidate more elegantly
    let postID = searchParams.get('p') ?? '-1';

    // NOTE: Sample Comment Data...
    const postData = {
    comments: [
        {
        id: 1,
        author: "John Smith",
        content: "Great article! Thanks for the info.",
        datePosted: "2023-11-08",
        votes: 10,
        isLoggedIn: isLoggedIn,
        postID: '-1',
        replies: [
            {
            id: 3,
            author: "Jane Doe",
            content: "Glad you liked it!",
            datePosted: "2023-11-09",
            votes: 5,
            isLoggedIn: isLoggedIn,
            postID: '-1'
            },
            {
            id: 4,
            author: "Mark Green",
            content: "This clarified a lot, thanks!",
            datePosted: "2023-11-09",
            votes: 3,
            isLoggedIn: isLoggedIn,
            postID: '-1'
            },
        ],
        },
        {
        id: 2,
        author: "Alice Brown",
        content: "I've been having a hard time with hooks, but this makes more sense now.",
        datePosted: "2023-11-08",
        votes: 8,
        isLoggedIn: isLoggedIn,
        postID: '-1'
        },
    ],
    };

    

    const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Handle send to backend new comment
        console.log(newComment);
        setNewComment('');
    };

    useEffect(() => {
        checkUserAuthentication().then((result) => setIsLoggedIn(result));
    }, []);

    return (
        <>
            <TopNavbar />
            <Container className="my-4">
                <Row className="justify-content-center">
                    <Col md={8}>
                        
                        <PostContent postID={Number.parseInt(postID)}/>
                        { /* Reply to post form */}

                        {
                            isLoggedIn
                            &&
                            <CommentForm postID={postID}/>
                        }

                        <hr></hr>
                        <h3>Comments:</h3>
                        <ListGroup>
                            {postData.comments.map(comment => (
                                <CommentItem
                                    key={comment.id}
                                    id={comment.id}
                                    author={comment.author}
                                    content={comment.content}
                                    datePosted={comment.datePosted}
                                    votes={comment.votes}
                                    replies={comment.replies}
                                    isLoggedIn={isLoggedIn}
                                    postID={postID}
                                />
                            ))}
                        </ListGroup>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default PostPage;
