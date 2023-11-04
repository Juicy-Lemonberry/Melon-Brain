'use client'
import React, { FC, useEffect, useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import '@/styles/profile-editor/SessionTokenEditor.scss';
import { getSessionToken } from '@/utils/accountSessionCookie';

interface SessionToken {
  browserInfo: string;
  lastUsedDate: Date;
  firstLoginDate: Date;
  sessionToken: string;
}

interface SessionTokenEditorProps {
  sessionTokens: SessionToken[];
  removeSessionTokens: (targetToken: string) => void;
}

const SessionTokenEditor: FC<SessionTokenEditorProps> = ({ sessionTokens, removeSessionTokens }) => {
  const [currentSessionToken, setCurrentSessionToken] = useState<string>('');

  useEffect(() => {
    const fetchSessionToken = async () => {
      const token = getSessionToken() as string;
      setCurrentSessionToken(token);
    };
    
    fetchSessionToken();
  }, []);

  // Sort it such that, the user's current session
  // will appear first.
  const sortedSessionTokens = [...sessionTokens].sort((a, b) =>
    a.sessionToken === currentSessionToken ? -1 : b.sessionToken === currentSessionToken ? 1 : 0
  );

  return (
    <>
      {sortedSessionTokens.map((session, index) => {
        // Disallow user to delete their own current session.
        const isCurrentSession = session.sessionToken === currentSessionToken;

        return (
          <Card key={session.sessionToken} className="card-with-shadow" style={{ width: '18rem', marginBottom: '1rem' }}>
            <Card.Body>
              <Card.Title>Session with {session.browserInfo}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">
                First login at {new Date(session.firstLoginDate).toLocaleString()}
              </Card.Subtitle>

              <Card.Text>
                Last used at {new Date(session.lastUsedDate).toLocaleString()}
              </Card.Text>

              {isCurrentSession ? (
                <Card.Text>This is your current session.</Card.Text>
              ) : (
                <Button variant="danger" onClick={() => removeSessionTokens(session.sessionToken)}>Remove Session</Button>
              )}
            </Card.Body>
          </Card>
        );
      })}
    </>
  );
}

export default SessionTokenEditor;
