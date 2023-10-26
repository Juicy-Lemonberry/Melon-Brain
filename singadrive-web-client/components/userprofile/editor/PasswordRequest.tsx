'use client'
import React, { useState } from 'react';
import '@/styles/profile-editor/PasswordRequest.scss';

interface PasswordModalProps {
  show: boolean;
  onClose: () => void;
  onSubmit: (password: string) => void;
}

// NOTE: Used for requesting the player for the current password...
const PasswordRequest: React.FC<PasswordModalProps> = ({ show, onClose, onSubmit }) => {
  const [password, setPassword] = useState('');

  if (!show) {
    return null;
  }

  return (
    <div className="password-modal">
      <div className="modal-content">
        <h2>Enter Current Password</h2>
        <input
          type="password"
          placeholder="Current Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={() => onSubmit(password)}>Submit</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default PasswordRequest;
