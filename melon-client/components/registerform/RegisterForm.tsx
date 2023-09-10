// From https://startbootstrap.com/snippets/registration-page

'use client'
import React, { useState, ChangeEvent, FormEvent } from 'react';
import Link from 'next/link';

import RegisterPasswordInput from './RegisterPasswordInput';
import RegisterUsernameInput from './RegisterUsernameInput';
import RegisterEmailInput from './RegisterEmailInput';

interface LoginFormProps {
    endpointUrl: string;
};

const RegisterForm: React.FC<LoginFormProps> = ({ endpointUrl }) => {

  //#region Form State
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [email, setEmail] = useState<string>('');

    const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
    };

    const handlePasswordChange = (newPassword: string) => {
      setPassword(newPassword);
    };
//#endregion 

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        try {
            const response = await sendDataToServer();

            if (response.status === 201) {
                // TODO
            } else {
                // TODO
            }
        } catch (error) {
            console.error(error);
        }
    };

    async function sendDataToServer(): Promise<Response> {
        const jsonData = {
            "email": email,
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
                <div className="card-img-left d-none d-md-flex">
                  {/* Background image for card set in CSS.. */}
                </div>
                <div className="card-body p-4 p-sm-5">
                  <h5 className="card-title text-center mb-5 fw-light fs-5">Register</h5>
                  <form onSubmit={handleSubmit}>

                    <RegisterEmailInput onChange={handleEmailChange} />
                    <RegisterUsernameInput handleUsernameChange={handleUsernameChange} />
                    <RegisterPasswordInput value={password} onChange={handlePasswordChange} />
                    <hr />
  
                    <div className="d-grid mb-2">
                      <button className="btn btn-lg btn-primary btn-login fw-bold text-uppercase" type="submit">
                        Register
                      </button>
                    </div>
  
                    <hr className="my-4" />

                    <div className="d-grid mb-5">
                    <Link href="/login"> {/* TODO: Actual route... */}
                        Have an account? Sign In
                    </Link>
                  </div>
  
                  </form>
                  <p className="attribution-text">
                    Photo by Elif Dörtdoğan from Pexels: <a href="https://www.pexels.com/photo/cup-of-coffee-on-open-book-18152065/" target="_blank" rel="noopener noreferrer">Source</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
    );
};

export default RegisterForm;