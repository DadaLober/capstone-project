import axios, { AxiosError } from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            // console.log('Request body:', req.body);
            const response = await axios.post('http://localhost:8080/register', req.body);

            console.log('response', response)
            res.status(200).json(response.data);
        } catch (error) {
            if (error instanceof AxiosError && error.response) {
                res.status(error.response.status).json(error.response.data);
            }
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}