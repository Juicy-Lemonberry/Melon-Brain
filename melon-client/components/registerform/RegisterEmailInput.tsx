'use client'
import React, { ChangeEvent, useState } from 'react';

interface RegisterEmailInputProps {
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const RegisterEmailInput: React.FC<RegisterEmailInputProps> = ({ onChange }) => {
  const [isValidEmail, setIsValidEmail] = useState(true);

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    onChange(e);

    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    const isValid = emailRegex.test(email);
    
    setIsValidEmail(isValid);
  };

  return (
    <div className="form-floating mb-3">
      <input
        type="text"
        className={`form-control ${isValidEmail ? '' : 'is-invalid'}`}
        id="floatingInputEmail"
        placeholder="something@outlook.com"
        onChange={handleEmailChange}
        required
        autoFocus
      />
      <label htmlFor="floatingInputEmail">Email</label>
      {!isValidEmail && (
        <div className="invalid-feedback">Please enter a valid email address.</div>
      )}
    </div>
  );
};

export default RegisterEmailInput;