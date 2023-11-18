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

interface Comment {
    commentID: string;
    username: string | null;
    displayName: string;
    createdDate: string;
    content: string;
    votes: number;
    children: Comment[];
}

async function getPostComments(postID: string): Promise<Comment[]> {
    const jsonData = {
        "post_id": postID
    };

    const options = {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(jsonData)
    };

    const endpointUrl = `${config.API_BASE_URL}/api/forum-comment/get-post-comments`;
    const response = await fetch(endpointUrl, options);
    const data = await response.json();

    if (!response.ok) {
        return [];
    }

    console.log(data.comments);
    return data.comments as Comment[];
}

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
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [comments, setComments] = useState<Comment[]>([]);

    const searchParams = useSearchParams();
    // TODO: Invalidate more elegantly
    let postID = searchParams.get('p') ?? '-1';

    useEffect(() => {
        checkUserAuthentication().then((result) => setIsLoggedIn(result));
        getPostComments(postID).then((result) => setComments(result));
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
                            <CommentForm postID={postID} parentID={null}/>
                        }

                        <hr></hr>
                        <h3>Comments:</h3>
                        <ListGroup>
                            {comments.map(comment => (
                                <CommentItem
                                    key={comment.commentID}
                                    id={comment.commentID}
                                    username={comment.username}
                                    displayName={comment.displayName}
                                    content={comment.content}
                                    datePosted={comment.createdDate}
                                    votes={comment.votes}
                                    replies={comment.children}
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
