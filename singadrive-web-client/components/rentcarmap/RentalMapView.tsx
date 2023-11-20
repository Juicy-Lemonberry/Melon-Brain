'use client'
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import config from '@/config';
import carIcons from '@/utils/carMapIcons';
import CarInfoPanel from './CarInfoPanel';
import QuoteText from '../QuoteText';

interface Car {
  lat: number;
  lng: number;
  fuelLevel: number;

  regPlate: string;
  modelID: string;
  modelName: string;
  manufacturerID: string;
  manufacturerName: string;
  fuelType: string;
  category: string;
}

async function getRentableVehicles() : Promise<Car[]> {
  const response = await fetch(config.API_BASE_URL + '/api/rent-map/rentable-vehicles')
  const data = await response.json();

  return data as Car[];
}

const RentalMapView: React.FC = () => {
  // Static map config.
  const mapStartPosition: [number, number] = [1.3521, 103.8198];
  const maxBounds: [[number, number], [number, number]] = [
    [1.16, 103.59],
    [1.47, 104.04]
  ];
 
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const handleClick = (car: Car) => {
    setSelectedCar(car);
  };

  const handleClose = () => {
    setSelectedCar(null);
  };

  // Fetch location of cars from server after map load.
  const [carLocations, setCarLocations] = useState<Car[]>([]);
  useEffect(() => {
    getRentableVehicles().then((result) => setCarLocations(result));
  }, []);

  return (
    <>
      <div style={{ position: 'relative', height: '100vh' }}>
        <MapContainer 
          center={mapStartPosition}
          zoom={13} 
          style={{ height: '100%', width: '100%' }}
          maxBounds={maxBounds}  
          minZoom={11} 
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          {carLocations.map((car: Car, index: number) => (
            // TODO: Different car icons (color) depending on car statuses
            <Marker key={index} position={[car.lat, car.lng]} icon={carIcons.green} eventHandlers={{ click: () => handleClick(car) }}>
              <Popup>
                <p>{car.modelName}</p>
                <QuoteText text={`${car.category}, powered by ${car.fuelType}`}></QuoteText>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      <div style={{ position: 'absolute', top: 0, right: 0, zIndex: 1000 }}>
        {selectedCar && <CarInfoPanel carInfo={selectedCar} onClose={handleClose} />}
      </div> 
    </>
  );
};

export default RentalMapView;
