'use client'
import config from '@/config';
import { getSessionToken } from '@/utils/accountSessionCookie';
import React, { useState, FC } from 'react';
import { Button, Form } from 'react-bootstrap';
import UAParser from 'ua-parser-js';

interface CommentFormProp {
  postID: string;
}

async function createNewCommentRequest(postID: string, content: string) : Promise<boolean> {
    const parser = new UAParser();
    const browserInfo = parser.getBrowser().name;
    const sessionToken = getSessionToken();

    const jsonData = {
        "session_token": sessionToken,
        "post_id": postID,
        "content": content,
        "browser_info": browserInfo
    };

    const options = {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(jsonData)
    };

    const response = await fetch(
        `${config.API_BASE_URL}/api/forum-comment/create-comment`,
        options
    );

    return response.status === 200;
}

const CommentForm: FC<CommentFormProp> = ({ postID }) => {
    const [commentContent, setCommentContent] = useState('');

    const handleReplySubmit = (e: React.FormEvent) => {
        e.preventDefault();

        createNewCommentRequest(postID, commentContent).then((result) => {
            // TODO: Fail/Success message...
            window.location.reload();
        });
    };

    return (
        <Form onSubmit={handleReplySubmit}>
            <Form.Group className="mb-3" controlId="newComment">
            <Form.Label>Reply to this post</Form.Label>
            <Form.Control
                as="textarea"
                rows={3}
                value={commentContent}
                onChange={e => setCommentContent(e.target.value)}
                placeholder="Write your comment here..."
            />
            </Form.Group>
            <Button variant="primary" type="submit">
                Post Comment
            </Button>
        </Form>
    );
};

export default CommentForm;
