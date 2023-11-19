'use client'
import React, { useState, FC } from 'react';
import { Card, ListGroup, Button, Badge } from 'react-bootstrap';
import CommentForm from './CommentForm';
import Link from 'next/link';
import VoteMenu from './VoteMenu';

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

const CommentItem: FC<CommentProps> = ({ id, username, displayName, content, datePosted, replies, loginID, loginUsername, postID }) => {
    const [showReplyForm, setShowReplyForm] = useState(false);
    const isUserContent = (username === loginUsername);

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
            </Card.Title>
            <Card.Subtitle className="mb-2 text-muted">
            <Badge bg="secondary">{new Date(datePosted).toLocaleDateString()}</Badge>
            </Card.Subtitle>
            <Card.Text>{content}</Card.Text>
            <VoteMenu contentType='COMMENT' contentID={id} accountID={loginID} isAccountContent={isUserContent}/>
            {loginID && !showReplyForm && (
                <Button variant="secondary" className="mt-2" onClick={() => setShowReplyForm(true)}>
                Reply
                </Button>
            )}
            {showReplyForm && (
                <CommentForm postID={postID} parentID={id}/>
            )}
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
