'use client'
import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import React from 'react';
import TopNavbar from '@/components/TopNavbar';
import { Card, ListGroup } from 'react-bootstrap';
import "@/styles/CategoryPage.scss"

const PostItem = dynamic(() => import('@/components/forum/category/PostItem'), {
    ssr: false 
});

const CategoryPage = () => {
    const searchParams = useSearchParams();
    const category = searchParams.get('c');

    useEffect(() => {
        // TODO: backend route to fetch category data...
        // then populate onto the list of posts below...
    }, [category]);

    return (
    <>
        <TopNavbar/>
        <div className="d-flex flex-column align-items-center">
            <h1>Forum Category: {category}</h1>
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