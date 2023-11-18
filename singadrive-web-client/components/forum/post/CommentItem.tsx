'use client'
import React, { useState, FC } from 'react';
import { Card, ListGroup, Button, Badge } from 'react-bootstrap';
import CommentForm from './CommentForm';
import Link from 'next/link';

interface Comment {
    commentID: string;
    username: string | null;
    displayName: string;
    createdDate: string;
    content: string;
    votes: number;
    children: Comment[];
}

interface CommentProps {
  id: string;
  username: string | null;
  displayName: string;
  content: string;
  datePosted: string;
  votes: number;
  // NOTE: For nested comments
  replies: Comment[];

  isLoggedIn: boolean;
  postID: string;
}

const CommentItem: FC<CommentProps> = ({ id, username, displayName, content, datePosted, votes, replies, isLoggedIn, postID }) => {
    const [showReplyForm, setShowReplyForm] = useState(false);

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
            {isLoggedIn && (
                <div>
                <Button variant="success" className="m-1" onClick={() => {/* TODO: Upvote logic */}}>Upvote</Button>
                <span className="ml-2 mr-2">Votes: {votes}</span>
                <Button variant="danger" className="m-1" onClick={() => {/* TODO: Downvote logic */}}>Downvote</Button>
                </div>
            )}
            {isLoggedIn && !showReplyForm && (
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
                    votes={reply.votes}
                    replies={reply.children}
                    isLoggedIn={isLoggedIn}
                    postID={postID}
                />
            ))}
            </ListGroup>
        )}
        </ListGroup.Item>
    );
};

export default CommentItem;
