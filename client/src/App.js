import React, { useEffect, useState } from 'react'
import API_BASE_URL from './config';

function App() {

  const [backendData, setBackendData] = useState([{}])

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/data`).then((response) => {
    console.log(response); // Log the response
    return response.json();
    }).then((data) => {
        setBackendData(data);
      }
    ).catch((error) => {
      console.error('Error fetching data:', error);
    });

  }, [])

  return (
    <div>
      {(typeof backendData.testman === 'undefined') ? (
        <p>Loading.....</p>
      ) : (
        backendData.testman.map((testMsg, i) => (
          <p key={i}>{testMsg}</p>
        ))
      )}
    </div>
  )
}

export default App