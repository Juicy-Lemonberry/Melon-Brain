'use client'
import React, { useEffect, useState } from 'react';
import { Card, Badge } from 'react-bootstrap';
import config from '@/config';
import Link from 'next/link';

interface PostContentProps {
    postID: number;
}

interface PostInformation {
    postID: number;
    categoryID: number | null;
    username: string | null;
    displayName: string | null;
    tags: string[];
    postDate: string;
    title: string;
    content: string;
}

function erroredPostInformation(): PostInformation {
    return {
        postID: -1,
        categoryID: null,
        username: null,
        displayName: 'Error Loading Page!',
        tags: [],
        postDate: new Date(1990, 0, 1).toISOString(),
        title: "An error occurred!",
        content: "An error occurred! Maybe the post doesn't exist, or try refreshing the page!"
    };
}

async function fetchPostInformation(postID: number): Promise<PostInformation | null> {
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

const PostContent: React.FC<PostContentProps> = ({ postID }) => {
    const [postInformation, setPostInformation] = useState<PostInformation | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetchPostInformation(postID).then((result) => {
            setLoading(false);
            if (result == null) {
                setPostInformation(erroredPostInformation());
            } else {
                setPostInformation(result);
            }
        });
    }, [postID]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!postInformation) {
        return <div>Error loading post.</div>;
    }

    const renderTags = (tags: string[]) => {
        return tags.map((tag, index) => (
            <Link key={index} href={`/forum/tag?tag=${encodeURIComponent(tag)}`} passHref>
                <a className="tag-badge-link">
                    <Badge bg="secondary" className="me-1">
                        {tag}
                    </Badge>
                </a>
            </Link>
        ));
    };

    return (
        <Card className="mb-3">
            <Card.Header as="h3">{postInformation.title}</Card.Header>
            <Card.Body>
                <Card.Subtitle className="mb-2 text-muted d-flex justify-content-between align-items-center">
                    <span>Created by&nbsp;
                        {postInformation.username ? (
                            <Link href={`/profile?username=${encodeURIComponent(postInformation.username)}`}>
                                <a className="text-reset">{postInformation.displayName}</a>
                            </Link>
                        ) : (
                            'Deleted User'
                        )}
                    </span>
                    <Badge bg="secondary">{new Date(postInformation.postDate).toLocaleDateString()}</Badge>
                </Card.Subtitle>
                <Card.Text className="my-3">{postInformation.content}</Card.Text>
                {renderTags(postInformation.tags)}
            </Card.Body>
        </Card>
    );
};

export default PostContent;