'use client'
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import config from '@/config';

interface Car {
  location: [number, number];
  name: string;
  model: string;
}

const RentalMapView: React.FC = () => {
  const [carLocations, setCarLocations] = useState<Car[]>([]);
  const mapStartPosition: [number, number] = [1.3521, 103.8198];

  useEffect(() => {
    fetch(config.API_BASE_URL + '/api/rent-map/rentable-cars')
      .then((response) => response.json())
      .then((data) => {
        setCarLocations(data.result);
      })
      .catch((error) => console.error('Error fetching car locations:', error));
  }, []);

  return (
    <MapContainer center={mapStartPosition} zoom={13} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      {carLocations.map((car: Car, index: number) => (
        <Marker key={index} position={car.location}>
          <Popup>
            {`Name: ${car.name}, Model: ${car.model}`}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default RentalMapView;
