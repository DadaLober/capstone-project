import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';
import { extractCookies, updateCookie } from '@/pages/api/utils';
import { getRefreshToken, checkRefreshTokenExpiration } from '@/pages/api/utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            // Extract cookies
            const { token, refreshToken } = extractCookies(req);

            if (token && refreshToken) {
                const axiosInstance = axios.create({
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                // const isTokenExpired = await checkRefreshTokenExpiration(axiosInstance);

                // if (isTokenExpired) {
                //     // If token is expired, try to refresh it
                //     const refreshedResponse = await getRefreshToken(axiosInstance, refreshToken);

                //     if (refreshedResponse) {
                //         // Update token and refreshToken in cookie
                //         updateCookie(req, res, refreshedResponse.token, refreshedResponse.refreshToken);
                //     } else {
                //         throw new Error('Failed to refresh token');
                //     }
                // }
                const response = await axiosInstance.get('http://localhost:8080/api/v1/users');
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
