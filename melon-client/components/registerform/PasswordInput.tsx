'use client'
import React, { useState, ChangeEvent, FormEvent } from 'react';
import Link from 'next/link';
import zxcvbn from 'zxcvbn'; 

interface PasswordInputProps {
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

const PasswordInput: React.FC<PasswordInputProps> = ({ value, onChange }) => {

  //#region Form State
  const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    // To toggle password visibility...
    const [showPassword, setShowPassword] = useState<boolean>(false);
    // Password strength indication...
    const [passwordStrength, setPasswordStrength] = useState<number>(0);

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
    };


    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newPassword = e.target.value;

        const isLengthValid = newPassword.length >= 4 && newPassword.length <= 64;
        const isCharacterValid = /^[a-zA-Z0-9!@#$%^&*()-_+=<>?]+$/.test(newPassword);

        if (isLengthValid && isCharacterValid) {
            setPassword(newPassword);
        }

        const strength = zxcvbn(newPassword).score;
        setPasswordStrength(strength);

        onChange(newPassword);
    };
//#endregion 
    
    const passwordIsInvalidLength = (): boolean => {
        const newPassword = password;
        return newPassword.length < 4 || newPassword.length > 64;
    };

    const passwordIsInvalidCharacter = (): boolean => {
        const newPassword = password;
        return !/^[a-zA-Z0-9!@#$%^&*()-_+=<>?]+$/.test(newPassword);
    };

    return (
        <>
        {/* Password field */} 
        <div className="form-floating mb-3">
            <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                id="floatingInputPassword"
                placeholder="my password!"
                onChange={handlePasswordChange}
                required
                autoFocus
            />
            <label className="mb-2" htmlFor="floatingInputPassword">Password</label>
            
            {/* Password error messages... */}
            {passwordIsInvalidLength() && (
            <div className="invalid-feedback">
                Password must be 4 to 64 characters long.
            </div>
            )}
            <div className="form-text mb-3">
            {passwordIsInvalidCharacter() && (
                <p className="text-danger">
                    Password must contain only alphanumeric and special characters.
                </p>
            )}
            </div>

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

export default PasswordInput;