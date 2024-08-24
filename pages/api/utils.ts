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

export async function getRefreshToken(axiosInstance: any, refreshToken: string) {
    try {
        const response = await axiosInstance.post('http//localhost:8080/refresh', {
            refreshToken,
        });
        return response.data;
    } catch (error) {
        console.error('Error refreshing token:', error);
        throw new Error('Failed to refresh token');
    }
}

export async function checkRefreshTokenExpiration(axiosInstance: any) {
    try {
        const response = await axiosInstance.get('http//localhost:8080/refresh');
        return response.data.isExpired;
    } catch (error) {
        console.error('Error checking token expiration:', error);
        return true;
    }
}

export function updateCookie(req: NextApiRequest, res: NextApiResponse, newToken: string, newRefreshToken: string) {
    const cookie = `token=${newToken}; Path=/; HttpOnly; Max-Age=900;`;
    const refreshCookie = `refreshToken=${newRefreshToken}; Path=/; HttpOnly; Max-Age=3600;`;
    res.setHeader('Set-Cookie', [cookie, refreshCookie]);
}