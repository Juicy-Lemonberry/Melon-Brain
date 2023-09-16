'use client'
import React, { ChangeEventHandler, useState } from 'react';

interface RegisterUsernameInputProps {
  handleUsernameChange: ChangeEventHandler<HTMLInputElement>;
}

const RegisterUsernameInput: React.FC<RegisterUsernameInputProps> = ({ handleUsernameChange }) => {
  const [warning, setWarning] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    // Alphanumericals, Hypens, and Underscores.
    const isValid = /^[a-zA-Z0-9-_]+$/.test(inputValue);
    const isLengthValid = inputValue.length >= 4 && inputValue.length <= 64;

    if (!isValid) {
      setWarning('Only alphanumeric characters, hyphens, and underscores are allowed.');
    } else if (!isLengthValid) {
      setWarning('Username must be between 4 and 64 characters.');
    } else {
      setWarning(null);
    }

    handleUsernameChange(e);
  };

  return (
    <div className="form-floating mb-3">
      <input
        type="text"
        className={`form-control ${warning ? 'is-invalid' : ''}`}
        id="floatingInputUsername"
        placeholder="myusername"
        onChange={handleInputChange}
        required
        autoFocus
      />
      <label htmlFor="floatingInputUsername">Username</label>
      {warning && <div className="invalid-feedback">{warning}</div>}
    </div>
  );
};

export default RegisterUsernameInput;