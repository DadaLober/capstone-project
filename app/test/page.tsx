'use client';

import axios from 'axios';
import { useState } from 'react';

export default function TestPage() {
    const [data, setData] = useState(null);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            const response = await axios.get('api/users');
            setData(response.data);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setError(error.message);
            } else {
                setError('An unknown error occurred');
            }
        }
    };

    const handleClick = () => {
        fetchData();
    };

    return (
        <div>
            <h1>Test Page</h1>
            <button onClick={handleClick}>Fetch Data</button>
            {data && <p>Data: {JSON.stringify(data)}</p>}
            {error && <p>Error: {error}</p>}
        </div>
    );
}
