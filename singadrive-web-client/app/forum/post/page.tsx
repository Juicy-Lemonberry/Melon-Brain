'use client'
import React, { useEffect, useState } from 'react';
import TopNavbar from '@/components/TopNavbar';
import { useSearchParams } from 'next/navigation';
import { Button, Form, Row, Col, Container, ListGroup } from 'react-bootstrap';
import CommentItem from '@/components/forum/post/CommentItem';
import PostContent from '@/components/forum/post/PostContent';
import UAParser from 'ua-parser-js';
import { getSessionToken } from '@/utils/accountSessionCookie';
import config from '@/config';
import CommentForm from '@/components/forum/post/CommentForm';
import VoteMenu from '@/components/forum/post/VoteMenu';
import EditContentForm from '@/components/forum/EditContentForm';
import DeleteContentButton from '@/components/forum/DeleteContentButton';

interface Comment {
    commentID: string;
    username: string | null;
    displayName: string;
    createdDate: string;
    content: string;
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

    return data.comments as Comment[];
}

interface LoginInfo {
    loginID: string | null;
    loginUsername: string | null;
}

async function checkUserAuthentication(): Promise<LoginInfo> {
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
        return {
            loginID: data["account_id"],
            loginUsername: data["username"]
        }
    }

    return {
        loginID: null,
        loginUsername: null
    };
}

interface PostInformation {
    postID: string;
    categoryID: number | null;
    username: string | null;
    displayName: string | null;
    tags: string[];
    postDate: string;
    title: string;
    content: string;
}

async function fetchPostInformation(postID: string): Promise<PostInformation | null> {
    try {
        const jsonData = { "post_id": postID };
        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(jsonData)
        };

        const response = await fetch(`${config.API_BASE_URL}/api/forum-post/get-post`, options);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return await response.json();
    } catch (error) {
        console.error('Failed to fetch post information:', error);
        return null;
    }
}

async function submitEditedPost(postID: string, newContent: string): Promise<boolean> {
    const parser = new UAParser();
    const browserInfo = parser.getBrowser().name;
    const sessionToken = getSessionToken();

    const jsonData = {
        "session_token": sessionToken,
        "browser_info": browserInfo,
        "post_id": postID,
        "new_content": newContent
    };

    const options = {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(jsonData)
    };

    const response = await fetch(
        `${config.API_BASE_URL}/api/forum-post/edit-post`,
        options
    );

    return response.status === 200;
}

const PostPage = () => {
    const [loginInfo, setLoginInfo] = useState<LoginInfo>({
        loginID: null,
        loginUsername: null
    });
    const [comments, setComments] = useState<Comment[]>([]);
    const [postInformation, setPostInformation] = useState<PostInformation | null>(null);
    const [isLoadingInformation, setIsLoadingInformation] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    const searchParams = useSearchParams();
    // TODO: Invalidate more elegantly
    let postID = searchParams.get('p') ?? '-1';

    const isLoggedInUserPost = (postInformation?.username === loginInfo.loginUsername);

    useEffect(() => {
        checkUserAuthentication().then((result) => setLoginInfo(result));
        getPostComments(postID).then((result) => setComments(result));
        fetchPostInformation(postID).then((result) => {
            setPostInformation(result);
            setIsLoadingInformation(false);
        })
    }, []);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
    };

    const handleEditSubmit = (newContent: string) => {
        submitEditedPost(postID, newContent).then((result) => {
            // TODO: Handle error message on failure...
            window.location.reload();
        });
    };

    return (
        <>
            <TopNavbar />
            <Container className="my-4">
                <Row className="justify-content-center">
                    <Col md={8}>
                        
                        {
                            isEditing ? (
                                <EditContentForm originalContent={postInformation == null ? '' : postInformation?.content} onEditSubmit={handleEditSubmit} onEditCancel={handleCancelEdit}/>
                            ) : (
                                <>
                                    <PostContent postInformation={postInformation} isLoading={isLoadingInformation}/>
                                    {isLoggedInUserPost && 
                                        <>
                                            <Button onClick={handleEditClick}>Edit</Button>
                                            <DeleteContentButton contentID={postID} contentType='POST' />
                                        </>
                                    }
                                    { /* Reply to post form */}
                                </>
                            )
                        }

                        <hr></hr>
                        <VoteMenu contentType='POST' contentID={postID} accountID={loginInfo.loginID} isAccountContent={isLoggedInUserPost}/>
                        
                        <hr></hr>
                        {
                            loginInfo.loginID
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
                                    replies={comment.children}
                                    loginID={loginInfo.loginID}
                                    loginUsername={loginInfo.loginUsername}
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
