'use client'
import React from 'react';

interface ExternalLink {
    title: string;
    url: string;
}

interface ExternalLinksPreviewProps {
    links: ExternalLink[];
}

const ExternalLinksPreview: React.FC<ExternalLinksPreviewProps> = ({ links }) => {

    if (links.length === 0) {
        return null;
    }

    return (
        <div>
            <h2>External Links</h2>
            <ul>
            {links.map((link, index) => (
                <li key={index}>
                <a href={link.url} target="_blank" rel="noopener noreferrer">
                    {link.title}
                </a>
                </li>
            ))}
            </ul>
        </div>
    );
};

export default ExternalLinksPreview;