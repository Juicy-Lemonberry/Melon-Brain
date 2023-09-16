'use client'
import React, { useState, ChangeEvent, FormEvent } from 'react';
import zxcvbn from 'zxcvbn'; 

interface LoginPasswordInputProps {
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

const LoginPasswordInput: React.FC<LoginPasswordInputProps> = ({ value, onChange }) => {

    // To toggle password visibility...
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
    };
    
    return (
        <>
        {/* Password field */} 
        <div className="form-floating mb-3">
            <input
                type={showPassword ? "text" : "password"}
                className={`form-control`}
                id="floatingInputPassword"
                placeholder="my password!"
                onChange={handlePasswordChange}
                required
                autoFocus
            />
            <label className="mb-2" htmlFor="floatingInputPassword">Password</label>

            {/* Toggle password visibility... */}
            <div className="password-toggle mb-2 mr-2">
                <input
                    type="checkbox"
                    id="passwordToggle"
                    onChange={togglePasswordVisibility}
                />
                <label className="ml-2" htmlFor="passwordToggle"> Show Password</label>
            </div>
        </div>
        </>
    );
};

export default LoginPasswordInput;