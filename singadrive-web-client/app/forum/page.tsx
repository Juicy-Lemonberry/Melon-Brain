import TopNavbar from "@/components/TopNavbar";
import { Container, Row, Col } from "react-bootstrap";
import CategoryCard from "@/components/forum/CategoryCard";

function ForumPage() {
  return (
    <>
        <TopNavbar />
        <Container className="my-4">
            <Row className="mb-3">
                <Col>
                    <h1>Welcome to the Forum</h1>
                    <p>A space for discussion and help about cars!.</p>
                </Col>
            </Row>
            
            <hr></hr>
            <CategoryCard 
                title="Annoucements" 
                description="Public annoucements to be posted here"
                urlQuery="annoucement"/>
            
            <hr></hr>
            <CategoryCard 
                title="General Discussion" 
                description="Discuss any topic related to cars!"
                urlQuery="general"/>

            <CategoryCard
                title="Issues"
                description="Post any issues or bugs you have encountered here!"
                urlQuery="issues"/>
            
            <hr></hr>
            <CategoryCard 
                title="Random" 
                description="All topics welcome!"
                urlQuery="random"/>
        </Container>
    </>
  );
}

export default ForumPage;
