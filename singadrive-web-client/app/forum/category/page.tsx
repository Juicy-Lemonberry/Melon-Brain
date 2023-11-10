'use client'
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import React from 'react';
import TopNavbar from '@/components/TopNavbar';
import { getSessionToken } from '@/utils/accountSessionCookie';
import { Card, ListGroup, Form, Button } from 'react-bootstrap';
import "@/styles/CategoryPage.scss"
import UAParser from 'ua-parser-js';
import config from '@/config';

const PostItem = dynamic(() => import('@/components/forum/category/PostItem'), {
    ssr: false 
});

async function checkUserAuthentication(): Promise<boolean> {
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
        return true;
    }
    return false;
}

const CategoryPage = () => {
    const searchParams = useSearchParams();
    const categoryTitle = searchParams.get('ctitle');
    const categoryId = searchParams.get('cid');
    const [userAuthenticated, setUserAuthenticated] = useState(false);

    useEffect(() => {
        checkUserAuthentication().then((result) => setUserAuthenticated(result));
        // TODO: API call to backend to fetch all posts...
    }, [categoryId]);

//#region SUBMIT NEW POST LOGIC
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      // TODO: Backend call...
      console.log('New Post:', { title, content });
  
      setTitle('');
      setContent('');
    };  
//#endregion
    
    return (
    <>
        <TopNavbar/>
        <div className="d-flex flex-column align-items-center">
            {/* NOTE: Show create new post forms if user is authenticated... */}
            { userAuthenticated &&
            <>
                <h1>Create new post</h1>
                <Form onSubmit={handleSubmit} className="w-100 mb-3" style={{ maxWidth: '24rem' }}>
                <Form.Group className="mb-3" controlId="postTitle">
                    <Form.Label>Title</Form.Label>
                    <Form.Control 
                    type="text" 
                    placeholder="Enter post title" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="postContent">
                    <Form.Label>Content</Form.Label>
                    <Form.Control 
                    as="textarea" 
                    rows={3} 
                    placeholder="Enter post content" 
                    value={content} 
                    onChange={(e) => setContent(e.target.value)} 
                    />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Post
                </Button>
                </Form>
            </>
            }

            <hr/>
            <h1>Forum Category: {categoryTitle}</h1>
            <Card style={{ width: '24rem' }}>
                {/* NOTE: Popular, as in top3 recently active posts... */}
                <Card.Header className="card-list-header">Popular</Card.Header>
                <ListGroup variant="flush">
                    <PostItem 
                        postID={10}
                        title="some popular post"
                        author='Derpman'
                        postedOn={new Date()}
                        lastActivity={new Date()}/>
                </ListGroup>
                <Card.Header className="card-list-header">Main</Card.Header>
                <ListGroup variant="flush">
                    <PostItem 
                        postID={11}
                        title="another postt"
                        author='stickman'
                        postedOn={new Date()}
                        lastActivity={new Date()}/>
                    <PostItem 
                        postID={12}
                        title="some post"
                        author='POstman'
                        postedOn={new Date()}
                        lastActivity={new Date()}/>
                </ListGroup>
            </Card>
        </div>
    </>
    );
};

export default CategoryPage;