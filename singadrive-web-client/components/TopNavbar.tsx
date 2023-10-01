'use client'
import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { getSessionToken, removeSessionToken } from '@/utils/accountSessionCookie';
import UAParser from 'ua-parser-js';
import config from '@/config';

const TopNavbar: React.FC = () => {
  const [user, setUser] = useState(null);
  
  const handleLogout = () => {
    removeSessionToken();
    window.location.href = '/login';
  };

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

    const endpointUrl = `${config.API_BASE_URL}/api/users/authenticate`;
    const response = await fetch(endpointUrl, options);
    const data = await response.json();

    if (response.ok) {
      if (data["message"] === "OK") {
        setUser(data);
      } else {
        removeSessionToken();
      }
    } else {
      console.error('Failed to fetch user data:', data);
    }
  }

  useEffect(() => {
    const token = getSessionToken();
    if (token) {
      getUserData();
    }
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" href="/">SingaDrive</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          {/* Home and About to the left side */}
          <ul className="navbar-nav">
            <li className="nav-item"><Link className="nav-link" href="/">Home</Link></li>
            <li className="nav-item"><Link className="nav-link" href="/about">About</Link></li>
          </ul>

          { /* User Account panel at right side */ }
          <ul className="navbar-nav ms-auto">
            {user ? (
              // If user exists, show user information
              <>
                <li className="nav-item">
                  <span className="navbar-text mx-2">{user["username"]}</span>
                </li>
                <li className="nav-item">
                  <button onClick={handleLogout} className="btn btn-danger">Logout</button>
                </li>
              </>
            ) : (
              // If no user, show Login and Signup buttons
              <>
                <li className="nav-item">
                  <Link href="/login"><a className="btn btn-primary mx-2">Login</a></Link>
                </li>
                <li className="nav-item">
                  <Link href="/register"><a className="btn btn-success">Signup</a></Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default TopNavbar;

