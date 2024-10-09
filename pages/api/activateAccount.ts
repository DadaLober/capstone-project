import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';
import { extractCookies } from '@/pages/api/utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'PATCH') {
        try {
            const { token, refreshToken } = extractCookies(req);
            const { id } = req.body;

            if (token && refreshToken) {
                const axiosInstance = axios.create({
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                const response = await axiosInstance.patch(`http://localhost:8080/api/v1/users/${id}`, { status: 'active' });
                res.status(200).json(response.data);
            } else {
                res.status(401).json({ message: 'Invalid cookie format' });
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                switch (error.response?.status) {
                    case 403:
                        res.status(403).json({ message: 'User not authorized' });
                        break;
                    default:
                        res.status(500).json({ message: 'Internal Server Error' });
                        break;
                }
            }
            res.status(500).json({ message: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
