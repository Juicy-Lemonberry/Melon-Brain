'use client'
import React from 'react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { RandomAvatar } from 'react-random-avatars';
import config from '@/config';

interface UserProfile {
  username: string;
  email: string;
  description: string;
  // Add more fields as needed
}

const ProfilePage = () => {
  const searchParams = useSearchParams();
  
  const rawUsername = searchParams.get('username');
  let username: string;
  if (rawUsername !== null) {
    username = rawUsername;
  } else {
    username = '';
    console.error("Username is not provided in the query parameters.");
  }

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (username && username !== '') {
      const apiRoute = config.API_BASE_URL + "/api/public-users/profile";

      fetch(`${apiRoute}?username=${username}`)
        .then(response => response.json())
        .then(data => {

          console.log(data);
          if (data.message === 'SUCCESS') {
            setUserProfile(data.data);
          } else if (data.message === 'NOT FOUND') {
            setUserProfile({
              username: 'NOT FOUND',
              email: '',
              description: 'This user does not exist!'
            });
          }

        })
        .catch(error => {
          console.error('Error fetching user profile:', error);
          setUserProfile({
              username: 'ERROR',
              email: '',
              description: 'Error fetching user profile, try again or contact admin!'
            });
        });
    } else {

      setUserProfile({
        username: 'NOT FOUND',
        email: '',
        description: 'This user does not exist!'
      });
    }
  }, [username]);

  return (
    <Container className='mt-5'>
      <Row className='justify-content-center'>
        <Col md={6}>
          <Card>
            <Card.Header>User Profile</Card.Header>
            <Card.Body>
              {userProfile ? (
                <>
                  <RandomAvatar name={username} size={30}/>
                  <Card.Title>{userProfile.username}</Card.Title>
                  <Card.Text>Email: {userProfile.email}</Card.Text>
                  <Card.Text>Description: {userProfile.description}</Card.Text>
                  {/* Add more user details here */}
                </>
              ) : (
                'Loading...'
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProfilePage;

