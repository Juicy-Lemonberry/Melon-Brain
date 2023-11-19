'use client'

import QuoteText from "@/components/QuoteText";
import TopNavbar from "@/components/TopNavbar";
import config from "@/config";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, Container } from "react-bootstrap";

async function getTagDescription(tagTitle: string): Promise<string | null> {
    try {
        const jsonData = { "tag_title": tagTitle };
        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(jsonData)
        };

        const response = await fetch(`${config.API_BASE_URL}/api/forum-tag/get-tag`, options);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return (await response.json())["description"];
    } catch (error) {
        console.error('Failed to fetch post information:', error);
        return null;
    }
}

const TagPage = () => {
    const [description, setDescription] = useState<string | null>(null);

    const searchParams = useSearchParams();
    // TODO: Invalidate more elegantly
    let tagTitle = searchParams.get('tag') ?? '-1';

    useEffect(() => {
        getTagDescription(tagTitle).then((result) => setDescription(result));
    }, [tagTitle])

    // TODO: A section below to show all post under the given tag...
    return (
        <>
            <TopNavbar />
            <Container className="my-4">
            <Card.Header as="h3">{tagTitle}</Card.Header>
            <Card.Body>
                { 
                    description == null ? 
                    <QuoteText text="Seems like there is no description for this tag..."></QuoteText>
                    :
                    description
                }
            </Card.Body>
            </Container>
        </>
    );
};

export default TagPage;
