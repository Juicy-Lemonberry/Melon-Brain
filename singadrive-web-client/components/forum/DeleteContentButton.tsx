'use client'
import config from '@/config';
import { getSessionToken } from '@/utils/accountSessionCookie';
import React, { FC } from 'react';
import { Button } from 'react-bootstrap';
import UAParser from 'ua-parser-js';
import { useRouter } from "next/navigation";

interface DeleteContentProps {
    contentID: string;
    contentType: string;
}

async function requestDeleteContent(jsonData: any, apiURL: string){
    const options = {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(jsonData)
    };

    const response = await fetch(
        apiURL,
        options
    );

    return response.status === 200;
}

const DeleteContentButton: FC<DeleteContentProps> = ({ contentID, contentType }) => {

    const router = useRouter();

    const triggerDeletion = () => {
        const parser = new UAParser();
        const browserInfo = parser.getBrowser().name;
        const sessionToken = getSessionToken();

        let jsonData = {};
        let apiURL = '';
        if (contentType == "POST") {
            jsonData = {
                "session_token": sessionToken,
                "browser_info": browserInfo,
                "post_id": contentID,
            };

            apiURL = `${config.API_BASE_URL}/api/forum-post/delete-post`;
        } else {
            jsonData = {
                "session_token": sessionToken,
                "browser_info": browserInfo,
                "comment_id": contentID,
            };

            apiURL = `${config.API_BASE_URL}/api/forum-comment/delete-comment`;
        }

        requestDeleteContent(jsonData, apiURL).then((result) => {
            // TODO: Bring user to back into the same post's category instead....
            if (contentType == "POST") {
                router.push(`/forum/`);
            } else {
                window.location.reload();
            }
        });
    }

    return (
        <Button className="m-3" variant="danger" onClick={() => triggerDeletion()}>Delete</Button>
    );
};

export default DeleteContentButton;