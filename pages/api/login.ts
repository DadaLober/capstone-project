import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            console.log('Request body:', req.body);
            const response = await axios.post('http://localhost:8080/login', req.body);
            res.status(200).json(response.data);
        } catch (error) {
            console.error('Error submitting form:', error);
            res.status(401).json({ message: 'Email or password is incorrect' });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}