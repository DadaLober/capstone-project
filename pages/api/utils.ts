import { NextApiRequest, NextApiResponse } from "next";

export function getTokenExpiration(token: string): number | null {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = Buffer.from(base64, 'base64').toString('binary');

    try {
        const payload = JSON.parse(jsonPayload);
        return payload.exp ? payload.exp * 1000 : null;
    } catch (error) {
        console.error('Error parsing JWT payload:', error);
        return null;
    }
}

export function extractCookies(req: NextApiRequest): { token?: string; refreshToken?: string } {
    const cookies = req.headers.cookie || '';
    const cookieParts = cookies.split(';');

    const tokenCookie = cookieParts.find(part => part.trim().startsWith('token='));
    const refreshTokenCookie = cookieParts.find(part => part.trim().startsWith('refreshToken='));

    return {
        token: tokenCookie ? tokenCookie.split('=')[1] : undefined,
        refreshToken: refreshTokenCookie ? refreshTokenCookie.split('=')[1] : undefined,
    };
}