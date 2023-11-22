'use client'
import QuoteText from "@/components/QuoteText";
import TopNavbar from "@/components/TopNavbar";
import CarItem from "@/components/rentcarmap/CarItem";
import config from "@/config";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, Container, ListGroup } from "react-bootstrap";

interface ModelDetail {
    id: string;
    name: string;
    description: string | null;
}

async function getModelDetail(modelID: string): Promise<ModelDetail | null> {
    try {
        const jsonData = { "model_id": modelID };
        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(jsonData)
        };

        const response = await fetch(`${config.API_BASE_URL}/api/rent-map/get-model-detail`, options);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log(data);
        return data as ModelDetail;
    } catch (error) {
        console.error('Failed to fetch manufacturer information:', error);
        return null;
    }
}

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

async function getModelVehicles(modelID: string): Promise<CarInfo[]> {
    try {
        const jsonData = { "model_id": modelID };
        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(jsonData)
        };

        const response = await fetch(`${config.API_BASE_URL}/api/rent-map/get-model-vehicles`, options);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log(data);
        return data as CarInfo[];
    } catch (error) {
        console.error('Failed to fetch vehicles:', error);
        return [];
    }
}

const ManufacturerPage = () => {
    const [carInformations, setCarInformations] = useState<CarInfo[]>([]);
    const [details, setDetails] = useState<ModelDetail>({
        id: '-1',
        name: 'loading...',
        description: 'loading...'
    });

    const searchParams = useSearchParams();
    // TODO: Invalidate more elegantly
    let modelID = searchParams.get('modelID') ?? '-1';

    useEffect(() => {
        getModelDetail(modelID).then((result) => {
            if (result == null){
                setDetails({
                    id: '-1',
                    name: 'Error',
                    description: `Error loading model information, perhaps it doesn't exists?`
                });

                return;
            }

            setDetails(result);
        });

        getModelVehicles(modelID).then((result) => setCarInformations(result));
    }, [modelID])

    // TODO: A section below to show all post under the given tag...
    return (
        <>
            <TopNavbar />
            <Container className="my-4">
                <Card.Header as="h3">{details.name}</Card.Header>
                <Card.Body>
                    { 
                        details.description == null ? 
                        <QuoteText text="Seems like there is no description for this model..."></QuoteText>
                        :
                        details.description
                    }
                </Card.Body>

                <h1>Cars belonging to model...</h1>
                <hr></hr>
                <ListGroup variant="flush">
                    {carInformations.map(carInfo => (
                        <CarItem
                            key={carInfo.registration_plate}
                            carInfo={carInfo}
                        />
                    ))}
                </ListGroup>
            </Container>
        </>
    );
};

export default ManufacturerPage;
