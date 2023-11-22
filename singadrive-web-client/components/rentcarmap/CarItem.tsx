'use client'
import QuoteText from "@/components/QuoteText";
import Link from "next/link";
import { FC } from "react";
import { Card, ListGroup } from "react-bootstrap";

interface CarInfo {
    model_id: string;
    model_name: string;
    manufacturer_id: string;
    manufacturer_name: string;
    category: string;
    fuel_type: string;
    registration_plate: string;
    is_rented: boolean;
}

interface CarItemProps {
    carInfo: CarInfo;
}

const CarItem: FC<CarItemProps> = ({ carInfo }) => {
    return (
        <ListGroup.Item className="car-item">
            <Card style={{ width: '18rem' }}>
                <Card.Title>{carInfo.registration_plate}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                    <Link href={`/rent-map/model?modelID=${encodeURIComponent(carInfo.model_id)}`} passHref>
                        <a className="model-link">{carInfo.model_name}</a>
                    </Link> 
                    {' '}manufactured by{' '}
                    <Link href={`/rent-map/manufacturer?manufacturerID=${encodeURIComponent(carInfo.manufacturer_id)}`} passHref>
                        <a className="manufacturer-link">{carInfo.manufacturer_name}</a>
                    </Link>
                </Card.Subtitle>
                <Card.Text>
                    {carInfo.category} powered by {carInfo.fuel_type}
                    {carInfo.is_rented && <QuoteText text="Currently being rented..."></QuoteText>}
                </Card.Text>
            </Card>
        </ListGroup.Item>
    );
};

export default CarItem;
