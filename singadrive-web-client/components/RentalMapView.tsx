'use client'
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import config from '@/config';
import carIcons from '@/utils/carMapIcons';

interface Car {
  location: [number, number];
  name: string;
  model: string;
}

const RentalMapView: React.FC = () => {
  // Static map config.
  const mapStartPosition: [number, number] = [1.3521, 103.8198];
  const maxBounds: [[number, number], [number, number]] = [
    [1.16, 103.59],
    [1.47, 104.04]
  ];
  
  // Fetch location of cars from server after map load.
  const [carLocations, setCarLocations] = useState<Car[]>([]);
  useEffect(() => {
    fetch(config.API_BASE_URL + '/api/rent-map/rentable-cars')
      .then((response) => response.json())
      .then((data) => {
        setCarLocations(data.result);
      })
      .catch((error) => console.error('Error fetching car locations:', error));
  }, []);

  return (
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
        <Marker key={index} position={car.location} icon={carIcons.green}>
          <Popup>
            {`Name: ${car.name}, Model: ${car.model}`}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default RentalMapView;
