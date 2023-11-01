'use client'
import React from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { RandomAvatar } from 'react-random-avatars';
import config from '@/config';
import ExternalLinksPreview from './ExternalLinksPreview';

const DescriptionEditor = dynamic(() => import('@/components/userprofile/DescriptionPreview'), {
  ssr: false
});

interface ExternalLink {
  title: string;
  url: string;
}

interface UserProfile {
  username: string;
  dislayName: string;
  email: string;
  description: string;
  externalLinks: ExternalLink[];
  birthday: string;
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
            console.log(userProfile?.birthday);
          } else if (data.message === 'NOT FOUND') {
            setUserProfile({
              username: 'NOT FOUND',
              email: '',
              description: 'This user does not exist!',
              dislayName: '',
              externalLinks: [],
              birthday: ''
            });
          }

        })
        .catch(error => {
          console.error('Error fetching user profile:', error);
          setUserProfile({
              username: 'ERROR',
              email: '',
              description: 'Error fetching user profile, try again or contact admin!',
              dislayName: '',
              externalLinks: [],
              birthday: ''
            });
        });
    } else {

      setUserProfile({
        username: 'NOT FOUND',
        email: '',
        description: 'This user does not exist!',
        dislayName: '',
        externalLinks: [],
        birthday: ''
      });
    }
  }, [username]);

  return (
    <Container className='mt-5'>
      <Row className='justify-content-center'>
        <Col md={6}>
          <Card>
            <Card.Header>{userProfile?.dislayName ?? "NOT FOUND"}</Card.Header>
            <Card.Body>
              {userProfile ? (
                <>
                  <RandomAvatar name={username} size={30}/>
                  <Card.Title>{userProfile.username} ({userProfile.email})</Card.Title>
                  <Card.Text>Birthday: {userProfile.birthday}</Card.Text>
                  <DescriptionEditor initialDescription={userProfile.description}/>
                  <ExternalLinksPreview links={userProfile.externalLinks}/>
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

