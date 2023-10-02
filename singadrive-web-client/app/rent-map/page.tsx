
import dynamic from 'next/dynamic';
import React from 'react';

const DynamicRentalMapView = dynamic(() => import('@/components/RentalMapView'), {
  ssr: false 
});

const RentMap: React.FC = () => {
  return (
    <div style={{ height: '100vh' }}>
      <DynamicRentalMapView />
    </div>
  );
};

export default RentMap;

