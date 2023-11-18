'use client'
import React, { useState, FC } from 'react';
import { Card, ListGroup, Button } from 'react-bootstrap';
import CommentForm from './CommentForm';


interface CommentProps {
  id: number;
  author: string;
  content: string;
  datePosted: string;
  votes: number;
  // NOTE: For nested comments
  replies?: CommentProps[];

  isLoggedIn: boolean;
  postID: string;
}

const CommentItem: FC<CommentProps> = ({ id, author, content, datePosted, votes, replies, isLoggedIn, postID }) => {
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [newReply, setNewReply] = useState('');

    const handleReplySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: send to backend to handle...
        console.log(newReply);
        setNewReply('');
    };

    return (
        <ListGroup.Item>
        <Card>
            <Card.Body>
            <Card.Title>{author}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">{datePosted}</Card.Subtitle>
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
                <CommentForm postID={postID}/>
            )}
            </Card.Body>
        </Card>
        {replies && replies.length > 0 && (
            <ListGroup>
            {/* NOTE: Recursively render nested comments */}
            {replies.map(reply => (
                <CommentItem
                    key={reply.id}
                    id={reply.id}
                    author={reply.author}
                    content={reply.content}
                    datePosted={reply.datePosted}
                    votes={reply.votes}
                    replies={reply.replies}
                    isLoggedIn={reply.isLoggedIn}
                    postID={postID}
                />
            ))}
            </ListGroup>
        )}
        </ListGroup.Item>
    );
};

export default CommentItem;
