import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';
import { extractCookies } from '@/pages/api/utils';

interface ReservationRequest {
    propertyId: number;
    userId: number;
    fee: number;
    expiresAt: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const { token, refreshToken } = extractCookies(req);

            if (token && refreshToken) {
                const axiosInstance = axios.create({
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                const reservationData: ReservationRequest = {
                    propertyId: req.body.params.id,
                    userId: 1,
                    fee: 100.00,
                    expiresAt: "2024-09-30T23:59:59Z",
                };
                console.log(reservationData);
                const response = await axiosInstance.post('http://localhost:8080/api/v1/reservations', reservationData);
                console.log("Server response:", response.data);
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
