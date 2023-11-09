import TopNavbar from "@/components/TopNavbar";
import { Container, Row, Col } from "react-bootstrap";
import config from "@/config";
import dynamic from 'next/dynamic';

const CategoryCard = dynamic(() => import("@/components/forum/CategoryCard"), { 
});

interface SectionCategories {
    category_id: number;
    section_id: number;
    category_ordering: number;
    section_ordering: number;
    section_title: string;
    category_title: string;
    description: string;
};

async function getSectionCategories() {
    const res = await fetch(
        `${config.API_BASE_URL}/api/forum-category/get-categories`,
        { cache: 'no-store' }
      );

    const resultJSON = await res.json();
    return resultJSON as SectionCategories[];
}

async function ForumPage() {
    const sectionCategories = await getSectionCategories();

    // TODO: Populate into the container...
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
