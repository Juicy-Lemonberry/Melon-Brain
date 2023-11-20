import React from 'react';
import styles from '@/styles/CarInfoPanel.module.scss';
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

interface CarInfoPanelProps {
  carInfo: Car;
  onClose: () => void;
}

const CarInfoPanel: React.FC<CarInfoPanelProps> = ({ carInfo, onClose }) => {
  return (
    <div className={styles['car-info-panel']}>
      <button className={styles['close-button']} onClick={onClose}>X</button>
      <h3>Car Information</h3>
      <p><strong>Model:</strong> {carInfo.modelName}</p>
      <p><strong>Manufacturer:</strong> {carInfo.manufacturerName}</p>
      <p><strong>Fuel Level:</strong> {carInfo.fuelLevel} / 100</p>
      <p><strong>Registration Plate:</strong> {carInfo.regPlate}</p>
      <hr></hr>
      <QuoteText text={`${carInfo.category}, powered by ${carInfo.fuelType}`}></QuoteText>
    </div>
  );
};

export default CarInfoPanel;
