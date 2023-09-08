'use client'
import React, { useState, ChangeEvent, FormEvent } from 'react';
import config from '@/config';

const ExampleForm: React.FC = () => {
    // Bind 'someData' variable to a function 'setSomeData'.
    // Calling 'setSomeData' will change 'someData',
    // AND it will refresh all the UI here to reflect changes.
    const [someData, setSomeData] = useState<string>('');
    const [message, setMessage] = useState<string>('');

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSomeData(e.target.value);
    };

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        try {
            const response = await sendDataToServer();

            if (response.status === 201) {
                setMessage('Data inserted successfully');
            } else {
                setMessage('Error inserting data');
            }
        } catch (error) {
            console.error(error);
            setMessage('Network error');
        }
    };

    async function sendDataToServer(): Promise<Response> {
        // Data to send...
        const jsonData = {
            "sampleContent": someData
        };
        
        // Set the server request options to POST with JSON file.
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(jsonData) // Send data in body. (String it first)
        };

        const response = await fetch(`${config.API_BASE_URL}/api/example/postgresman`, options);
        return response;
    };

    return (
        <div>
            <form onSubmit={(e) => handleSubmit(e)}>
                <input
                    type="text"
                    value={someData}
                    onChange={handleInputChange}
                    placeholder="Enter some data"
                />
                <button type="submit">Submit</button>
            </form>
            <p>{message}</p>
        </div>
    );
};

export default ExampleForm;