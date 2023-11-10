'use client'
import React, { useState, useEffect } from 'react';
import TopNavbar from "@/components/TopNavbar";
import { Container, Row, Col } from "react-bootstrap";
import dynamic from 'next/dynamic';
import config from "@/config";

const CategoryCard = dynamic(() => import("@/components/forum/CategoryCard"), { ssr: false });

interface SectionCategories {
    category_id: number;
    section_id: number | null;
    category_ordering: number;
    section_ordering: number | null;
    section_title: string | null;
    category_title: string;
    description: string;
}

const ForumPage = () => {
    const [sections, setSections] = useState<Record<number | string, SectionCategories[]>>({});

    useEffect(() => {
        const fetchSectionCategories = async () => {
            try {
                const res = await fetch(
                    `${config.API_BASE_URL}/api/forum-category/get-categories`,
                    { cache: 'no-store' }
                );
                const categories: SectionCategories[] = await res.json();

                const sectionsMap: Record<number | string, SectionCategories[]> = {};
                categories.forEach(category => {
                    const sectionKey = category.section_id === null ? 'null' : category.section_id;
                    if (!sectionsMap[sectionKey]) {
                        sectionsMap[sectionKey] = [];
                    }
                    sectionsMap[sectionKey].push(category);
                });

                Object.keys(sectionsMap).forEach(key => {
                    sectionsMap[key].sort((a, b) => a.category_ordering - b.category_ordering);
                });

                setSections(sectionsMap);
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            }
        };

        fetchSectionCategories();
    }, []);

    const sortedSections = Object.entries(sections).sort(([keyA, valA], [keyB, valB]) => {
        // Place 'null' sections at the bottom
        if (keyA === 'null') return 1;
        if (keyB === 'null') return -1;
        return (valA[0].section_ordering ?? Infinity) - (valB[0].section_ordering ?? Infinity);
    });

    return (
        <>
            <TopNavbar />
            <Container className="my-4">
                <Row className="mb-3">
                    <Col>
                        <h1>Welcome to the Forum</h1>
                        <p>A space for discussion and help about cars!</p>
                    </Col>
                </Row>
                
                {sortedSections.map(([sectionId, categories]) => (
                    <React.Fragment key={sectionId}>
                        {categories[0].section_title && <h2>{categories[0].section_title}</h2>}
                        <hr />
                        {categories.map((category, index) => (
                            <React.Fragment key={category.category_id}>
                                <CategoryCard 
                                    title={category.category_title} 
                                    description={category.description}
                                    urlQuery={`${category.category_id}`}
                                />
                            </React.Fragment>
                        ))}
                    </React.Fragment>
                ))}
            </Container>
        </>
    );
};

export default ForumPage;