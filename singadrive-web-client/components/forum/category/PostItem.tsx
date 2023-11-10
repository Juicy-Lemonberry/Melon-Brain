import QuoteText from "@/components/QuoteText";
import { FC } from "react";
import { ListGroup } from "react-bootstrap";

interface PostItemProps {
    postID: number;
    title: string;
    author: string;
    lastActivity: Date;
    postedOn: Date;
}

const PostItem: FC<PostItemProps> = ({postID, title, author, lastActivity, postedOn}) => {
    return (
        <ListGroup.Item action href={"/forum/post?p=" + postID}>
            <h4>{title}</h4>
            Posted by {author} on {postedOn.toLocaleString()}
            <QuoteText text={"Last Activity on " + lastActivity.toLocaleString()}/>
        </ListGroup.Item>
    );
  };
  
  export default PostItem;