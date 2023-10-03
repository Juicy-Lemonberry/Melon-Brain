import TopNavbar from '@/components/TopNavbar';
import dynamic from 'next/dynamic';
import React from 'react';


const DynamicRentalMapView = dynamic(() => import('@/components/rentcarmap/RentalMapView'), {
  ssr: false 
});

const RentMap: React.FC = () => {
  return (
    <>
      <TopNavbar/>
      <div style={{ height: '100vh' }}>
        <DynamicRentalMapView />
      </div>
    </>
  );
};

export default RentMap;

