'use client'
import React, { FC } from 'react';
import { Card, Button } from 'react-bootstrap';
import '@/styles/profile-editor/SessionTokenEditor.scss';

interface SessionToken {
  browserInfo: string;
  lastUsedDate: Date;
  firstLoginDate: Date;
}

interface SessionTokenEditorProps {
  sessionTokens: SessionToken[];
  removeSessionTokens: (index: number) => void;
}

const SessionTokenEditor: FC<SessionTokenEditorProps> = ({ sessionTokens, removeSessionTokens }) => {
  return (
    <>
      {sessionTokens.map((session, index) => (
        <Card key={index} className="card-with-shadow" style={{ width: '18rem', marginBottom: '1rem' }}>
          <Card.Body>
            <Card.Title>Session with {session.browserInfo}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">
              First login at {session.firstLoginDate.toLocaleString()}
            </Card.Subtitle>

            <Card.Text>
              Last used at {session.lastUsedDate.toLocaleString()}
            </Card.Text>
            <Button variant="danger" onClick={() => removeSessionTokens(index)}>Remove Session</Button>
          </Card.Body>
        </Card>
      ))}
    </>
  );
}

export default SessionTokenEditor;
