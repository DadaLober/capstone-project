import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { getTokenExpiration } from "./utils";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            const { token, refreshToken } = req.body;
            console.log('Request body:', token, refreshToken);
            const response = await axios.get('http://localhost:8080/refresh',
                {
                    headers: {
                        'Cookie': `refreshToken=${refreshToken}`
                    }
                });

            const tokenExpiration = getTokenExpiration(response.data.token) ?? 0;

            res.setHeader('Set-Cookie', [
                `token=${response.data.token}; Path=/; HttpOnly; Max-Age=${Math.floor((tokenExpiration - Date.now()) / 1000)};`,
            ])
            res.status(200).json(response.data);
        } catch (error) {
            console.error('Error submitting form:', error);
            res.status(500).json({ message: 'Error submitting form' });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}