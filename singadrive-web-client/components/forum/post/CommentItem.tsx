'use client'
import React, { useState, FC } from 'react';
import { Card, ListGroup, Button, Form } from 'react-bootstrap';


interface CommentProps {
  id: number;
  author: string;
  content: string;
  datePosted: string;
  votes: number;
  // NOTE: For nested comments
  replies?: CommentProps[];
}

const CommentItem: FC<CommentProps> = ({ author, content, datePosted, votes, replies }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(true);
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
            {!showReplyForm && (
                <Button variant="secondary" className="mt-2" onClick={() => setShowReplyForm(true)}>
                Reply
                </Button>
            )}
            {showReplyForm && (
                <Form onSubmit={handleReplySubmit}>
                <Form.Group className="mb-3 mt-2" controlId="replyComment">
                    <Form.Control
                    as="textarea"
                    rows={2}
                    value={newReply}
                    onChange={(e) => setNewReply(e.target.value)}
                    placeholder="Write your reply here..."
                    />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Submit Reply
                </Button>
                </Form>
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
                />
            ))}
            </ListGroup>
        )}
        </ListGroup.Item>
    );
};

export default CommentItem;
