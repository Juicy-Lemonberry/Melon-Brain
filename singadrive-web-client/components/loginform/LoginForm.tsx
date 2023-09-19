// From https://startbootstrap.com/snippets/registration-page

'use client'
import React, { useState, ChangeEvent, FormEvent } from 'react';
import Link from 'next/link';
import LoginPasswordInput from './LoginPasswordInput';
import LoginUsernameInput from './LoginUsernameInput';
import { UAParser } from 'ua-parser-js';
import { setSessionToken } from '@/utils/accountSessionCookie';

interface LoginFormProps {
    endpointUrl: string;
};

const LoginForm: React.FC<LoginFormProps> = ({ endpointUrl }) => {

  //#region Form State
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
    };

    const handlePasswordChange = (newPassword: string) => {
      setPassword(newPassword);
    };

//#endregion 

    function handleSubmitError(message: string) {
        // TODO: Error message
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        try {
            const response = await sendDataToServer();

            if (response.status === 200) {
              const { message, token } =  await response.json();
              setSessionToken(token);
            } else {
                // TODO
            }
        } catch (error) {
            console.error(error);
        }
    };

    async function sendDataToServer(): Promise<Response> {
        const parser = new UAParser();
        const browserName = parser.getBrowser().name;

        const jsonData = {
            "browser_name": browserName,
            "username": username,
            "password": password
        };
        
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(jsonData) 
        };

        const response = await fetch(endpointUrl, options);
        return response;
    };

    return (
        <div className="container">
          <div className="row">
            <div className="col-lg-10 col-xl-9 mx-auto">
              <div className="card flex-row my-5 border-0 shadow rounded-3 overflow-hidden">
                <div className="login-img card-img-left d-none d-md-flex">
                  {/* Background image for card set in CSS.. */}
                </div>
                <div className="card-body p-4 p-sm-5">
                  <h5 className="card-title text-center mb-5 fw-light fs-5">Login</h5>
                  <form onSubmit={handleSubmit}>
                    
                    <LoginUsernameInput handleUsernameChange={handleUsernameChange} />
                    <LoginPasswordInput value={password} onChange={handlePasswordChange} />
  
                    <div className="d-grid mb-2">
                      <button className="btn btn-lg btn-primary btn-login fw-bold text-uppercase" type="submit">
                        Login
                      </button>
                    </div>
  
                    <hr className="my-4" />

                    <div className="d-grid mb-5">
                      <Link href="/register">
                        New user? Register here
                      </Link>
                    </div>
  
                  </form>
                  <p className="attribution-text">
                    Photo by Elif Dörtdoğan from Pexels: <a href="https://www.pexels.com/photo/milkshake-in-long-glass-and-glass-drinking-straw-18152300/" target="_blank" rel="noopener noreferrer">Source</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
    );
};

export default LoginForm;