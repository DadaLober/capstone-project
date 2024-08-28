import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';
import { extractCookies } from './utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            console.log('Request body:', req.body);
            const { token, refreshToken } = extractCookies(req);
            const axiosInstance = axios.create({ headers: { Authorization: `Bearer ${token}` } });
            const response = await axiosInstance.post('http://localhost:8080/api/v1/properties', req.body);
            res.status(200).json(response.data);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Error submitting form:', error.response?.data);
                console.error('status:', error.response?.status);
                res.status(401).json({ message: error.response?.data });
            }
            else {
                console.error('Error submitting form:', error);
                res.status(500).json({ message: 'Error submitting form' });
            }
        }

    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}