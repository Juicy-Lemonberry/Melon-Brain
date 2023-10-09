import TopNavbar from '@/components/TopNavbar';
import dynamic from 'next/dynamic';
import React from 'react';

const ProfileEditorView = dynamic(() => import('@/components/userprofile/editor/EditorContent'), {
  ssr: false 
});

const EditProfilePage: React.FC = () => {
  return (
    <>
      <TopNavbar/>
      <ProfileEditorView />
    </>
  );
};

export default EditProfilePage;

