import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getTokenExpiration } from '@/pages/api/utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {

            console.log('Request body:', req.body);
            const response = await axios.post('http://localhost:8080/login', req.body);

            const { token, refreshToken } = response.data;
            const tokenExpiry = getTokenExpiration(token);
            const refreshTokenExpiry = getTokenExpiration(refreshToken);

            if (!tokenExpiry || !refreshTokenExpiry) {
                console.error('Could not extract expiration times from tokens');
                res.status(500).json({ message: 'Internal Server Error' });
                return;
            }

            res.setHeader('Set-Cookie', [
                `token=${token}; Path=/; HttpOnly; Max-Age=${Math.floor((tokenExpiry - Date.now()) / 1000)}`,
                `refreshToken=${refreshToken}; Path=/; HttpOnly; Max-Age=${Math.floor((refreshTokenExpiry - Date.now()) / 1000)}`
            ]);
            res.status(200).json(response.data);
            return;
        }
        catch (error: any) {
            if (error.response) {
                console.error('Error submitting form:', error.response.data);
                res.status(error.response.status).json({ message: error.response.data });
            } else {
                console.error('Error submitting form:', error);
                res.status(500).json({ message: 'Internal Server Error' });
            }
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
