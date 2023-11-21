'use client'
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import config from '@/config';
import carIcons from '@/utils/carMapIcons';
import CarInfoPanel from './CarInfoPanel';
import QuoteText from '../QuoteText';
import UAParser from 'ua-parser-js';
import { getSessionToken } from '@/utils/accountSessionCookie';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

async function getLoggedInUsername(): Promise<string | null> {
  const parser = new UAParser();
  const browserName = parser.getBrowser().name;
  const sessionToken = getSessionToken();

  const jsonData = {
    "browser_name": browserName,
    "session_token": sessionToken
  };

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(jsonData)
  };

  const endpointUrl = `${config.API_BASE_URL}/api/users/authenticate`;
  const response = await fetch(endpointUrl, options);

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  console.log(data);
  return data["username"];
}

async function getRentedVehicle(username: string): Promise<Car | null> {
  const jsonData = {
    "username": username,
  };

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(jsonData)
  };

  const endpointUrl = `${config.API_BASE_URL}/api/rent-map/get-rented-vehicle`;
  const response = await fetch(endpointUrl, options);

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  if (data == null){
    return data;
  }
  return data as Car;
}

async function endRental(registrationPlate: string): Promise<boolean> {
  const parser = new UAParser();
  const browserName = parser.getBrowser().name;
  const sessionToken = getSessionToken();

  const jsonData = {
    "browser_name": browserName,
    "session_token": sessionToken,
    "registration_plate": registrationPlate
  };

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(jsonData)
  };

  const endpointUrl = `${config.API_BASE_URL}/api/rent-map/end-vehicle-rental`;
  const response = await fetch(endpointUrl, options);

  if (!response.ok) {
    return false;
  }

  const data = await response.json();
  return data["message"] == "SUCCESS";
}

async function requestRental(registrationPlate: string) : Promise<boolean> {
  const parser = new UAParser();
  const browserName = parser.getBrowser().name;
  const sessionToken = getSessionToken();

  const jsonData = {
    "browser_name": browserName,
    "session_token": sessionToken,
    "registration_plate": registrationPlate
  };

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(jsonData)
  };

  const endpointUrl = `${config.API_BASE_URL}/api/rent-map/rent-vehicle`;
  const response = await fetch(endpointUrl, options);

  if (!response.ok) {
    return false;
  }

  const data = await response.json();
  return data["message"] == "SUCCESS";
}

function determineCarIconByFuel(fuelValue : number) {
  if (fuelValue >= 75){
    return carIcons.green;
  } else if (fuelValue >= 55) {
    return carIcons.yellow;
  } else if (fuelValue >= 30) {
    return carIcons.orange;
  }

  return carIcons.red
}

const RentalMapView: React.FC = () => {
  // Static map config.
  const mapStartPosition: [number, number] = [1.3521, 103.8198];
  const maxBounds: [[number, number], [number, number]] = [
    [1.16, 103.59],
    [1.47, 104.04]
  ];
 
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [rentedCar, setRentedCar] = useState<Car | null>(null);
  const handleClick = (car: Car) => {
    setSelectedCar(car);
  };

  const handleClose = () => {
    setSelectedCar(null);
  };

  const [carLocations, setCarLocations] = useState<Car[]>([]);

  const handleRentCar = async (registrationPlate: string) => {
    const success = await requestRental(registrationPlate);

    if (success) {
      const rentedCarIndex = carLocations.findIndex(x => x.regPlate === registrationPlate);
      const rentedCar = carLocations[rentedCarIndex];

      let newCarLocations = carLocations.filter(x => x.regPlate !== registrationPlate);
      setRentedCar(rentedCar);
      setCarLocations(newCarLocations);
      setSelectedCar(null);
      toast("Vehicle rented successfully!");
    } else {
      toast("Error starting the rental...");
    }

    return success;
  }

  const handleEndRental = async (registrationPlate: string) => {
    const success = await endRental(registrationPlate);

    if (success && rentedCar != null) {
      let newCarLocations = carLocations;
      newCarLocations.push(rentedCar);
      setRentedCar(null);
      setCarLocations(newCarLocations);
      setSelectedCar(null);
      toast("Rental ended successfully!");
    } else {
      toast("Error ending the rental...");
    }

    return success;
  }

  // Fetch location of cars from server after map load.
  useEffect(() => {
    getRentableVehicles().then((result) => setCarLocations(result));
    
    getLoggedInUsername().then((username) => {
      if (username == null){
        return;
      }

      getRentedVehicle(username).then((result) => {
        console.log(`Rented ${setRentedCar}`);
        setRentedCar(result);
      });
    });
  }, []);

  return (
    <>
      <ToastContainer />
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
            <Marker key={index} position={[car.lat, car.lng]} icon={determineCarIconByFuel(car.fuelLevel)} eventHandlers={{ click: () => handleClick(car) }}>
              <Popup>
                <p>{car.modelName}</p>
                <QuoteText text={`${car.category}, powered by ${car.fuelType}`}></QuoteText>
              </Popup>
            </Marker>
          ))}

          {
            rentedCar &&
            <Marker position={[rentedCar.lat, rentedCar.lng]} icon={carIcons.booked} eventHandlers={{ click: () => handleClick(rentedCar) }}>
              <Popup>
                <p>{rentedCar.modelName}</p>
                <QuoteText text={`You are booking this car!`}></QuoteText>
              </Popup>
            </Marker>
          }
        </MapContainer>
      </div>
      <div style={{ position: 'absolute', top: 0, right: 0, zIndex: 1000 }}>
        {selectedCar && <CarInfoPanel 
        carInfo={selectedCar} 
        onClose={handleClose}
        isRentedVehicle={rentedCar == null ? false : selectedCar.regPlate === rentedCar.regPlate}
        isRentingVehicle={rentedCar != null}
        onRequestEndRental={handleEndRental}
        onRequestStartRental={handleRentCar}
         />}
      </div> 
    </>
  );
};

export default RentalMapView;
