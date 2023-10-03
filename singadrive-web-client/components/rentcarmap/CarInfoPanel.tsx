import React from 'react';
import styles from '@/styles/CarInfoPanel.module.scss';

interface CarInfoPanelProps {
  name: string;
  model: string;
  onClose: () => void;
}

const CarInfoPanel: React.FC<CarInfoPanelProps> = ({ name, model, onClose }) => {
  return (
    <div className={styles['car-info-panel']}>
      <button className={styles['close-button']} onClick={onClose}>X</button>
      <h3>Car Information</h3>
      <p><strong>Name:</strong> {name}</p>
      <p><strong>Model:</strong> {model}</p>
    </div>
  );
};

export default CarInfoPanel;
