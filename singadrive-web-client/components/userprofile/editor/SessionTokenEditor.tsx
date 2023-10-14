'use client'
import React, { FC, useCallback } from 'react';
import { Card, Button } from 'react-bootstrap';

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
  const handleRemoveSession = useCallback(
    (index: number) => {
      removeSessionTokens(index);
    },
    [removeSessionTokens]
  );

  return (
    <>
      {sessionTokens.map((session, index) => (
        <Card key={index} style={{ width: '18rem', marginBottom: '1rem' }}>
          <Card.Body>
            <Card.Title>Login at {session.browserInfo}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">
              First Login at {session.firstLoginDate.toLocaleString()}
            </Card.Subtitle>

            <Card.Text>
              Last used at {session.lastUsedDate.toLocaleString()}
            </Card.Text>
            <Button variant="danger" onClick={() => handleRemoveSession(index)}>Remove Session</Button>
          </Card.Body>
        </Card>
      ))}
    </>
  );
}

export default SessionTokenEditor;
