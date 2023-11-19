'use client'
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import TopNavbar from '@/components/TopNavbar';
import { getSessionToken } from '@/utils/accountSessionCookie';
import { Card, ListGroup } from 'react-bootstrap';
import "@/styles/CategoryPage.scss"
import UAParser from 'ua-parser-js';
import config from '@/config';
import PostGrouping from '@/components/forum/category/PostGroupings';

const PostItem = dynamic(() => import('@/components/forum/category/PostItem'), {
    ssr: false 
});

interface Tag {
    id: number;
    name: string;
    description: string;
}

const CreatePostForm = dynamic(() => import('@/components/forum/category/CreatePostForm'), {
    ssr: false
});

async function fetchPresetTags(): Promise<Tag[]> {
    try {
        const res = await fetch(
            `${config.API_BASE_URL}/api/forum-post/get-tags`,
            { cache: 'no-store' }
        );
        const tags: Tag[] = await res.json();
        return tags;
    } catch (error) {
        console.error('Failed to fetch tags:', error);
        return [];
    }
}

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

    const [presetTags, setPresetTags] = useState<Tag[]>([]);
    const [userAuthenticated, setUserAuthenticated] = useState(false);

    useEffect(() => {
        checkUserAuthentication().then((result) => setUserAuthenticated(result));
        fetchPresetTags().then((result) =>  setPresetTags(result));
    }, [categoryId]);
    
    if (categoryId == null){
        return <div>Hmm, seems like you stumbled onto an unknown category...</div>
    }

    return (
    <>
        <TopNavbar/>
        <div className="d-flex flex-column align-items-center">
            {/* NOTE: Show create new post forms if user is authenticated... */}
            { 
                userAuthenticated &&
                <CreatePostForm categoryID={categoryId as string} presetTags={presetTags}/>
            }

            <hr/>
            <h1>Forum Category: {categoryTitle}</h1>
            <Card style={{ width: '24rem' }}>
                <PostGrouping categoryID={categoryId}/>
            </Card>
        </div>
    </>
    );
};

export default CategoryPage;