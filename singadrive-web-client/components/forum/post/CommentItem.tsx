'use client'
import React, { useState, FC } from 'react';
import { Card, ListGroup, Button, Badge } from 'react-bootstrap';
import CommentForm from './CommentForm';
import Link from 'next/link';
import VoteMenu from './VoteMenu';
import EditContentForm from '../EditContentForm';
import UAParser from 'ua-parser-js';
import { getSessionToken } from '@/utils/accountSessionCookie';
import config from '@/config';
import DeleteContentButton from '../DeleteContentButton';

interface Comment {
    commentID: string;
    username: string | null;
    displayName: string;
    createdDate: string;
    content: string;
    children: Comment[];
}

interface CommentProps {
  id: string;
  username: string | null;
  displayName: string;
  content: string;
  datePosted: string;
  // NOTE: For nested comments
  replies: Comment[];

  loginID: string | null;
  loginUsername: string | null;
  postID: string;
}

async function submitEditedComment(commentID: string, newContent: string) : Promise<boolean> {
    const parser = new UAParser();
    const browserInfo = parser.getBrowser().name;
    const sessionToken = getSessionToken();

    const jsonData = {
        "session_token": sessionToken,
        "browser_info": browserInfo,
        "comment_id": commentID,
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
        `${config.API_BASE_URL}/api/forum-comment/edit-comment`,
        options
    );

    return response.status === 200;
}

const CommentItem: FC<CommentProps> = ({ id, username, displayName, content, datePosted, replies, loginID, loginUsername, postID }) => {
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const isUserContent = (username === loginUsername);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
    };

    const handleEditSubmit = (newContent: string) => {
        submitEditedComment(id, newContent).then((result) => {
            // TODO: Handle error message on failure...
            window.location.reload();
        });
    };

    return (
        <ListGroup.Item>
        <Card>
            <Card.Body>
            <Card.Title>
                {username ? (
                    <Link href={`/profile?username=${encodeURIComponent(username)}`}>
                        <a className="text-reset">{displayName}</a>
                    </Link>
                ) : (
                    'Deleted User'
                )}

                {
                    isUserContent && <Badge className="mr-2 ml-2" bg="primary">You</Badge>
                }
            </Card.Title>
            <Card.Subtitle className="mb-2 text-muted">
            <Badge bg="secondary">{new Date(datePosted).toLocaleDateString()}</Badge>
            </Card.Subtitle>
            
            {
                isEditing ? (
                    <>
                        <EditContentForm originalContent={content} onEditSubmit={handleEditSubmit} onEditCancel={handleCancelEdit}/>
                    </>
                ) : (
                    <>
                        <Card.Text>{content}</Card.Text>
                        <VoteMenu contentType='COMMENT' contentID={id} accountID={loginID} isAccountContent={isUserContent}/>
                        {isUserContent &&                                         
                            <>
                                <Button onClick={handleEditClick}>Edit</Button>
                                <DeleteContentButton contentID={id} contentType='COMMENT' />
                            </>
                        }
                        <hr></hr>
                        
                        {loginID && !showReplyForm && (
                            <Button variant="secondary" className="mt-2" onClick={() => setShowReplyForm(true)}>
                            Reply
                            </Button>
                        )}

                        {showReplyForm && (
                            <CommentForm postID={postID} parentID={id}/>
                        )}
                    </>
                )
            }
            </Card.Body>
        </Card>
        {replies && replies.length > 0 && (
            <ListGroup>
            {/* NOTE: Recursively render nested comments */}
            {replies.map(reply => (
                <CommentItem
                    key={reply.commentID}
                    id={reply.commentID}
                    username={reply.username}
                    displayName={reply.displayName}
                    content={reply.content}
                    datePosted={reply.createdDate}
                    replies={reply.children}
                    loginID={loginID}
                    loginUsername={loginUsername}
                    postID={postID}
                />
            ))}
            </ListGroup>
        )}
        </ListGroup.Item>
    );
};

export default CommentItem;
