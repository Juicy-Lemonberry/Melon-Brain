'use client'
import dynamic from 'next/dynamic';
import React, { useState } from 'react';
import '@/styles/profile-editor/EditorContent.scss';

const DescriptionEditor = dynamic(() => import('@/components/userprofile/editor/DescriptionEditor'), {
  ssr: false 
});

const ProfileEditor: React.FC = () => {
  const [displayName, setDisplayName] = useState('Test');
  const [email, setEmail] = useState('testmail');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [description, setNewDescription] = useState<string>('');

  return (
    <div className="profile-editor">
      <h1>Edit Profile</h1>
        <div className="input-group">
          <label htmlFor="displayName">Display Name</label>
          <input
            type="text"
            id="displayName"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label htmlFor="oldPassword">Old Password</label>
          <input
            type="password"
            id="oldPassword"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label htmlFor="newPassword">New Password</label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        
        <div className="input-group">
          <label>Description</label>
        </div>
        <DescriptionEditor initialDescription='' onDescriptionChange={setNewDescription}/>
        
        <hr/>
        <button type="submit">Save Changes</button>
    </div>
  );
};

export default ProfileEditor;

