'use client'
import React, { useState, ChangeEvent, FormEvent } from 'react';
import zxcvbn from 'zxcvbn'; 

interface RegisterPasswordInputProps {
    value: string;
    onChange: (value: string) => void;
}

const passwordStrengthColor = (strength: number): string => {
  switch (strength) {
      case 0:
      case 1:
          return 'danger'; 
      case 2:
      case 3:
          return 'warning';
      case 4:
          return 'success';
      default:
          return 'secondary';
    }
};

const RegisterPasswordInput: React.FC<RegisterPasswordInputProps> = ({ value, onChange }) => {

    // To toggle password visibility...
    const [showPassword, setShowPassword] = useState<boolean>(false);
    // Password strength indication...
    const [passwordStrength, setPasswordStrength] = useState<number>(0);

    const [warning, setWarning] = useState<string | null>(null);

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newPassword = e.target.value;

        const isLengthValid = newPassword.length >= 4 && newPassword.length <= 64;
        const isCharacterValid = /^[a-zA-Z0-9!@#$%^&*()-_+=<>?]+$/.test(newPassword);

        if (!isLengthValid) {
            setWarning('Password must be 4 to 64 characters long.');
        } else if (!isCharacterValid) {
            setWarning('Password must contain only alphanumeric and special characters.');
        } else {
            setWarning(null);
        }

        const strength = zxcvbn(newPassword).score;
        setPasswordStrength(strength);

        onChange(newPassword);
    };
    
    return (
        <>
        {/* Password field */} 
        <div className="form-floating mb-3">
            <input
                type={showPassword ? "text" : "password"}
                className={`form-control ${warning ? 'is-invalid' : ''}`}
                id="floatingInputPassword"
                placeholder="my password!"
                onChange={handlePasswordChange}
                required
                autoFocus
            />
            <label className="mb-2" htmlFor="floatingInputPassword">Password</label>
            
            {/* Password error messages... */}
            {warning && (<div className="invalid-feedback">{warning}</div>)}

            {/* Toggle password visibility... */}
            <div className="password-toggle mb-2 mr-2">
            <input
                type="checkbox"
                id="passwordToggle"
                onChange={togglePasswordVisibility}
            />
            <label className="ml-2" htmlFor="passwordToggle"> Show Password</label>
            </div>

            {/* Password strength indicator... */}
            <div className="progress mb-3">
            <div
                className={`progress-bar bg-${passwordStrengthColor(passwordStrength)}`}
                role="progressbar"
                style={{ width: `${(passwordStrength / 4) * 100}%` }}
            />
            </div>
        </div>
        </>
    );
};

export default RegisterPasswordInput;