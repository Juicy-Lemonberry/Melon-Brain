'use client'
import UAParser from 'ua-parser-js';
import config from '@/config';
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import '@/styles/profile-editor/EditorContent.scss';
import { getSessionToken, removeSessionToken } from '@/utils/accountSessionCookie';
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';

interface ExternalLink {
  title: string;
  url: string;
}

const DescriptionEditor = dynamic(() => import('@/components/userprofile/editor/DescriptionEditor'), {
  ssr: false
});

const ProfileEditor: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [displayName, setDisplayName] = useState('Test');
  const [birthday, setBirthday] = useState<Date | null>(null);
  const [externalLinks, setExternalLinks] = useState<ExternalLink[]>([]);
  const [email, setEmail] = useState('testmail');
  const [newPassword, setNewPassword] = useState('');
  const [description, setNewDescription] = useState<string>('');


  async function getUserData(): Promise<void> {
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

    // TODO: Send API Request to get data....
  }

  useEffect(() => {
    const token = getSessionToken();
    if (token) {
      // TODO Get user data and populate...
    }
  }, []);

  return (
    <div className="profile-editor">
      <h1>Edit Profile</h1>

      <div className="input-group">
        <label>Username</label>
        <span>{username}</span>
      </div>

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
        <label>Birthday</label>
        <DatePicker selected={birthday} onChange={(date: Date) => setBirthday(date)} />
      </div>
      
      <div className="input-group">
        <label>External Links</label>
        {externalLinks.map((link, index) => (
          <div key={index}>
            <input
              type="text"
              placeholder="Title"
              value={link.title}
              onChange={(e) => {
                const newLinks = [...externalLinks];
                newLinks[index].title = e.target.value;
                setExternalLinks(newLinks);
              }}
            />
            <input
              type="url"
              placeholder="URL"
              value={link.url}
              onChange={(e) => {
                const newLinks = [...externalLinks];
                newLinks[index].url = e.target.value;
                setExternalLinks(newLinks);
              }}
            />
          </div>
        ))}
        <button onClick={() => setExternalLinks([...externalLinks, { title: '', url: '' }])}>Add Link</button>
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
