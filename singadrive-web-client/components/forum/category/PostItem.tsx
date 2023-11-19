'use client'
import QuoteText from "@/components/QuoteText";
import Link from "next/link";
import { FC } from "react";
import { Badge, ListGroup } from "react-bootstrap";
import "@/styles/forum/MiniPost.scss"

interface PostItemProps {
    postID: number;
    title: string;
    author: string | null;
    lastActivity: string | null;
    postedOn: string;
    tags: string[];
    contentDisplay: string;
}

const PostItem: FC<PostItemProps> = ({
    postID, 
    title, 
    author, 
    lastActivity, 
    postedOn, 
    tags, 
    contentDisplay
}) => {
    const renderTags = (tags: string[]) => tags.map((tag, index) => (
        <Link key={index} href={`/forum/tag?tag=${encodeURIComponent(tag)}`} passHref>
            <a className="tag-badge-link">
                <Badge bg="secondary" className="me-1">{tag}</Badge>
            </a>
        </Link>
    ));

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };
    
    return (
        <ListGroup.Item action href={`/forum/post?p=${postID}`} className="post-item">
            <h4 className="post-title">{title}</h4>
            <div className="post-info">
                Posted by {author ?? "a Deleted User"} on {formatDate(postedOn)}
            </div>
            {lastActivity && <QuoteText text={`Last Activity on ${formatDate(lastActivity)}`} />}
            <div className="post-tags">{renderTags(tags)}</div>
            <div className="post-preview">{contentDisplay}</div>
        </ListGroup.Item>
    );
};
  
export default PostItem;