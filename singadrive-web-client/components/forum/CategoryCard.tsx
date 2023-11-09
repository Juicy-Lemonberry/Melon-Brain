'use client'
import React, { FC } from "react";
import { Row, Col, Card, Button } from "react-bootstrap";

interface CategoryCardProps {
  title: string;
  description: string;
  urlQuery: string;
}

const CategoryCard: FC<CategoryCardProps> = ({title, description, urlQuery}) => {
  return (
    <Row className="justify-content-center">
      <Col md={4} sm={6} xs={12} className="mb-3">
      <Card className="shadow">
          <Card.Body>
          <Card.Title>{title}</Card.Title>
          <Card.Text>
              {description}
          </Card.Text>
          <Button variant="primary" href={"/forum/category?c=" + urlQuery}>Enter</Button>
          </Card.Body>
      </Card>
      </Col>
    </Row>
  );
}

export default CategoryCard;