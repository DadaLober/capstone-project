import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { extractCookies } from './utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            const { token, refreshToken } = extractCookies(req);
            //Remove cookie from App
            res.setHeader('Set-Cookie', [
                `token=; Path=/; HttpOnly; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT`,
                `refreshToken=; Path=/; HttpOnly; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT`,
            ]);

            //Remove cookie from backend
            const response = await axios.get('http://localhost:8080/logout', {
                headers: {
                    'Cookie': `token=${token}; refreshToken=${refreshToken}`
                }
            });
            if (response.status === 200) {
                res.status(200).json({ message: 'Logout successful' });
            }
            res.status(400).json({ message: 'Logout failed' });
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.log('error message: ', error.response?.data);
                console.log('error status: ', error.response?.status);
                res.status(401).json({ message: error.response?.data });
            }
            console.log('error: ', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }

}
