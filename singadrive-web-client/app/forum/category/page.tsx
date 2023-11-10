'use client'
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import React from 'react';
import TopNavbar from '@/components/TopNavbar';
import { Card, ListGroup, Form, Button } from 'react-bootstrap';
import "@/styles/CategoryPage.scss"

const PostItem = dynamic(() => import('@/components/forum/category/PostItem'), {
    ssr: false 
});

const CategoryPage = () => {
    const searchParams = useSearchParams();
    const categoryTitle = searchParams.get('ctitle');
    const categoryId = searchParams.get('cid');

    useEffect(() => {
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
            {/* TODO: Don't show this if user is not logged in... */}
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

            <hr/>
            <h1>Forum Category: {categoryTitle}</h1>
            <Card style={{ width: '24rem' }}>
                <Card.Header className="card-list-header">Pinned</Card.Header>
                <ListGroup variant="flush">
                    <PostItem 
                        postID={10}
                        title="some annouced pin post"
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