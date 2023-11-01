import TopNavbar from '@/components/TopNavbar';
import dynamic from 'next/dynamic';
import React from 'react';

const ProfileMainView = dynamic(() => import('@/components/userprofile/MainContent'), {
  ssr: false 
});

const ProfilePage: React.FC = () => {
  return (
    <>
      <TopNavbar/>
      <ProfileMainView />
    </>
  );
};

export default ProfilePage;

