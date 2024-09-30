import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';
import { extractCookies } from '@/pages/api/utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'DELETE') {
        try {
            const { token, refreshToken } = extractCookies(req);
            const { propertyId, fileId } = req.query;

            if (token && refreshToken) {
                const axiosInstance = axios.create({
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                const response = await axiosInstance.delete(`http://localhost:8080/api/v1/properties/${propertyId}/files/${fileId}`);
                res.status(200).json(response.data);
            } else {
                res.status(401).json({ message: 'Invalid cookie format' });
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                switch (error.response?.status) {
                    case 403:
                        res.status(403).json({ message: 'User not authorized' });
                        console.error(error.response?.data);
                        break;
                    case 404:
                        res.status(404).json({ message: 'File not found' });
                        break;
                    default:
                        res.status(500).json({ message: 'Internal Server Error' });
                        break;
                }
            } else {
                res.status(500).json({ message: 'An unexpected error occurred' });
            }
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
