'use client'
import React, { ChangeEventHandler, useState } from 'react';

interface LoginUsernameInputProps {
  handleUsernameChange: ChangeEventHandler<HTMLInputElement>;
}

const LoginUsernameInput: React.FC<LoginUsernameInputProps> = ({ handleUsernameChange }) => {

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleUsernameChange(e);
  };

  return (
    <div className="form-floating mb-3">
      <input
        type="text"
        className={`form-control`}
        id="floatingInputUsername"
        placeholder="myusername"
        onChange={handleInputChange}
        required
        autoFocus
      />
      <label htmlFor="floatingInputUsername">Username</label>
    </div>
  );
};

export default LoginUsernameInput;