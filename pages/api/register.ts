console.log('register.ts file loaded');

import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const body = req.body;
        try {
            console.log('Request body:', body);
            const response = await axios.post('http://localhost:8080/register', body);
            console.log('Server response:', response.data);
            res.status(200).json(response.data);
        } catch (error) {
            res.status(500).json({ message: 'Error submitting form' });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}