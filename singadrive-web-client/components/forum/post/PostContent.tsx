'use client'
import React from 'react';
import { Card, Badge } from 'react-bootstrap';
import Link from 'next/link';

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

interface PostContentProps {
    postInformation: PostInformation | null;
    isLoading: boolean;
}

function erroredPostInformation(): PostInformation {
    return {
        postID: "-1",
        categoryID: null,
        username: null,
        displayName: 'Error Loading Page!',
        tags: [],
        postDate: new Date(1990, 0, 1).toISOString(),
        title: "An error occurred!",
        content: "An error occurred! Maybe the post doesn't exist, or try refreshing the page!"
    };
}

const PostContent: React.FC<PostContentProps> = ({ postInformation, isLoading }) => {
    let filterPostInformation: PostInformation = erroredPostInformation();
    if (postInformation != null) {
        filterPostInformation = postInformation;
    }

    if (isLoading) {
        return <div>Loading...</div>;
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
            <Card.Header as="h3">{filterPostInformation.title}</Card.Header>
            <Card.Body>
                <Card.Subtitle className="mb-2 text-muted d-flex justify-content-between align-items-center">
                    <span>Created by&nbsp;
                        {filterPostInformation.username ? (
                            <Link href={`/profile?username=${encodeURIComponent(filterPostInformation.username)}`}>
                                <a className="text-reset">{filterPostInformation.displayName}</a>
                            </Link>
                        ) : (
                            'Deleted User'
                        )}
                    </span>
                    <Badge bg="secondary">{new Date(filterPostInformation.postDate).toLocaleDateString()}</Badge>
                </Card.Subtitle>
                <Card.Text className="my-3">{filterPostInformation.content}</Card.Text>
                {renderTags(filterPostInformation.tags)}
            </Card.Body>
        </Card>
    );
};

export default PostContent;