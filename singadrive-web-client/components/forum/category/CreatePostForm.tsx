'use client'
import { FC, FormEvent, useState } from "react";
import { Form, Button, Dropdown } from 'react-bootstrap';
import { getSessionToken } from '@/utils/accountSessionCookie';
import config from '@/config';
import { useRouter } from "next/navigation";

interface Tag {
    id: number;
    name: string;
    description: string;
}

interface CreatePostFormProps {
    categoryID: string;
    presetTags: Tag[];
}

async function createNewPostRequest(postTitle: string, postContent: string, categoryID: string, postTags: Tag[]): Promise<number | null> {
    const sessionToken = getSessionToken();

    let tagsID: number[] = [];
    for (let i = 0; i < postTags.length; i++) {
        tagsID.push(postTags[i].id);
    }

    const jsonData = {
        "session_token": sessionToken,
        "tags_id": tagsID,
        "post_title": postTitle,
        "post_content": postContent,
        "category_id": categoryID
    };

    const options = {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(jsonData)
    };

    const response = await fetch(
        `${config.API_BASE_URL}/api/forum-post/create-post`,
        options
    );

    if (response.status === 200) {
        const jsonResult = await response.json();
        return jsonResult.post_id;
    }

    return null;
}

const PostItem: FC<CreatePostFormProps> = ({categoryID, presetTags}) => {
    const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const router = useRouter();

    const handleTagSelection = (tag: Tag): void => {
        // Add tag, but if exists, remove it.
        if (selectedTags.includes(tag)) {
            setSelectedTags(selectedTags.filter(t => t !== tag));
        } else {
            setSelectedTags([...selectedTags, tag]);
        }
    }; 

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        createNewPostRequest(title, content, categoryID, selectedTags).then((postID) => {
            if (postID == null){
                // TODO: Pass flashcard message 
                console.log("Failed...");
                return;
            }

            router.push(`/forum/post?c=${postID}`);
        });
    };  
    return (
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
                <Dropdown>
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                    Select Tags
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                    {presetTags.map((tag, index) => (
                        <Dropdown.Item key={index} onClick={() => handleTagSelection(tag)}>
                        {tag.name}
                        </Dropdown.Item>
                    ))}
                    </Dropdown.Menu>
                </Dropdown>

                <div className='mb-2 mt-2'>
                    <strong>Selected Tags:</strong>
                    <ul>
                        {selectedTags.map((tag, index) => (
                        <li key={index}>{tag.name}</li>
                        ))}
                    </ul>
                </div>

                <Button variant="primary" type="submit">
                    Post
                </Button>
                </Form>
            </>
    );
  };
  
  export default PostItem;