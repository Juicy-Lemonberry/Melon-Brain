'use client'
import { FC, useEffect, useState } from "react";
import { Card, ListGroup } from "react-bootstrap";
import PostItem from "@/components/forum/category/PostItem";
import config from "@/config";

interface PostGroupingProps {
    categoryID: string;
}

interface PostInformation {
    postID: number;
    displayName: string | null;
    tags: string[];
    postDate: string;
    title: string;
    miniContent: string;
    lastActivity: string | null;
}

async function fetchCategoryPosts(categoryID: string): Promise<PostInformation[]> {

    const jsonData = {
        "category_id": categoryID
    };

    const options = {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(jsonData)
    };

    const endpointUrl = `${config.API_BASE_URL}/api/forum-category/get-posts`;
    const response = await fetch(endpointUrl, options);
    const data = await response.json();

    if (!response.ok) {
        return [];
    }

    
    return data["posts"] as PostInformation[];
}

const PostGrouping: FC<PostGroupingProps> = ({ categoryID }) => {
    const [postsInformation, setPostsInformation] = useState<PostInformation[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        fetchCategoryPosts(categoryID).then((result) => {
            setPostsInformation(result);
            setLoading(false);
        });
    }, [categoryID]);

    if (loading) {
        return <div>Fetching posts...</div>;
    }

    if (postsInformation.length === 0) {
        return <div>Hmm, there seems to be nothing here...</div>;
    }

    // Sort by lastActivity to get top 3 most popular posts.
    // NOTE: If theres only 3 posts or less in total, all posts will
    // be displayed in 'main' section...
    const sortedPosts = [...postsInformation].sort((a, b) => 
        new Date(b.lastActivity || 0).getTime() - new Date(a.lastActivity || 0).getTime()
    );
    const popularPosts = sortedPosts.length > 3 ? sortedPosts.slice(0, 3) : [];
    const mainPosts = sortedPosts.length > 3 ? sortedPosts.slice(3) : sortedPosts;

    return (
        <>
            {popularPosts.length > 0 && (
                <>
                    <Card.Header className="card-list-header">Popular</Card.Header>
                    <ListGroup variant="flush">
                        {popularPosts.map(postInfo => (
                            <PostItem
                                key={postInfo.postID}
                                postID={postInfo.postID}
                                title={postInfo.title}
                                author={postInfo.displayName}
                                lastActivity={postInfo.lastActivity}
                                postedOn={postInfo.postDate}
                                tags={postInfo.tags}
                                contentDisplay={postInfo.miniContent}
                            />
                        ))}
                    </ListGroup>
                </>
            )}
            <Card.Header className="card-list-header">Main</Card.Header>
            <ListGroup variant="flush">
                {mainPosts.map(postInfo => (
                    <PostItem
                        key={postInfo.postID}
                        postID={postInfo.postID}
                        title={postInfo.title}
                        author={postInfo.displayName}
                        lastActivity={postInfo.lastActivity}
                        postedOn={postInfo.postDate}
                        tags={postInfo.tags}
                        contentDisplay={postInfo.miniContent}
                    />
                ))}
            </ListGroup>
        </>
    );
};

export default PostGrouping;