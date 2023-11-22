import React, { useState } from 'react';
import styles from '@/styles/CarInfoPanel.module.scss';
import QuoteText from '../QuoteText';
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Link from 'next/link';

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

interface CarInfoPanelProps {
  carInfo: Car;
  onClose: () => void;
  isRentingVehicle: boolean;
  isRentedVehicle: boolean;
  onRequestStartRental: (registrationPlate: string) => Promise<boolean>;
  onRequestEndRental: (registrationPlate: string) => Promise<boolean>;
  isLoggedIn: boolean;
}

const CarInfoPanel: React.FC<CarInfoPanelProps> = ({
  carInfo, onClose, isRentingVehicle, isRentedVehicle, onRequestStartRental, onRequestEndRental, isLoggedIn
}) => {
  const [loading, setLoading] = useState(false);

  const handleStartRental = async () => {
    setLoading(true);
    const success = await onRequestStartRental(carInfo.regPlate);
    setLoading(false);
  };

  const handleEndRental = async () => {
    setLoading(true);
    const success = await onRequestEndRental(carInfo.regPlate);
    setLoading(false);
  };

  return (
    <div className={styles['car-info-panel']}>
      <Button variant="outline-secondary" className={styles['close-button']} onClick={onClose}>X</Button>
      <h3>Car Information</h3>
      <p><strong>Model:</strong>
        <Link href={`/rent-map/model?modelID=${encodeURIComponent(carInfo.modelID)}`} passHref>
          <a className="model-link">{carInfo.modelName}</a>
        </Link></p>
      <p><strong>Manufacturer:</strong> 
      <Link href={`/rent-map/manufacturer?manufacturerID=${encodeURIComponent(carInfo.manufacturerID)}`} passHref>
          <a className="manufacturer-link">{carInfo.manufacturerName}</a>
        </Link></p>
      <p><strong>Fuel Level:</strong> {carInfo.fuelLevel} / 100</p>
      <p><strong>Registration Plate:</strong> {carInfo.regPlate}</p>
      <hr />
      <QuoteText text={`${carInfo.category}, powered by ${carInfo.fuelType}`}></QuoteText>
      <hr />
      {
        isLoggedIn && <p>Login to rent a vehicle...</p>
      }

      {(isRentedVehicle && isLoggedIn) ? (
        <Button disabled={loading} variant="danger" onClick={handleEndRental}>End Rental</Button>
      ) : isRentingVehicle ? (
        <p>You are currently renting a vehicle...</p>
      ) : (
        <Button disabled={loading} variant="primary" onClick={handleStartRental}>Rent this Vehicle</Button>
      )}
    </div>
  );
};

export default CarInfoPanel;
