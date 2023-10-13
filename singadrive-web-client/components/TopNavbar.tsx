'use client'
import UAParser from 'ua-parser-js';
import config from '@/config';
import { getSessionToken, removeSessionToken } from '@/utils/accountSessionCookie';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { RandomAvatar } from 'react-random-avatars';
import React, { useEffect, useState } from 'react';
import '@/styles/TopNavbar.scss';

const TopNavbar: React.FC = () => {
  const [user, setUser] = useState(null);
  
  const handleLogout = async () => {
    try {
      // Send a DELETE request to the server to delete the session token
      await fetch(`${config.API_BASE_URL}/api/users/session`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ session_token: getSessionToken() })
      });
      
      removeSessionToken();
      window.location.href = '/login';
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };
    

  // Request to authenticate session token from cookie,
  // then fetch user data.
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
    <Navbar bg="dark" variant="dark" expand="lg">
      <Navbar.Brand className="ms-3" href="/">SingaDrive</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link href="/">Home</Nav.Link>
          <Nav.Link href="/about">About</Nav.Link>
        </Nav>
        <Nav className="ms-auto me-5">
          {user ? (
            <NavDropdown title={
              <div className="custom-dropdown-toggle">
                { /* TODO: Replace with actual user profile picture if has one*/ }
                <RandomAvatar name={user['username']} size={30}/>
                <span className="ms-2 align-middle">{user['username']}</span>
              </div>
            } id="nav-dropdown" className="custom-nav-dropdown">
              <NavDropdown.Item href={`/profile?username=${user['username']}`}>View Profile</NavDropdown.Item>
              <NavDropdown.Item href="/rentals">View Rentals</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="/profile/edit">Edit Profile</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
            </NavDropdown>
          ) : (
            <>
              <Nav.Link href="/login">Login</Nav.Link>
              <Nav.Link href="/register">Register</Nav.Link>
            </>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default TopNavbar;

