import axios from 'axios';
import { jwtVerify, JWTPayload as JoseJWTPayload } from 'jose';
import { cookies } from 'next/headers';

export const SECRET_KEY = '12345678901234567890123456789012';

export interface CustomJWTPayload extends JoseJWTPayload {
    user: {
        id: number;
        firstName: string;
        lastName: string;
        email: string;
        roles: string[];
        status: string;
        contactNumber?: string;
    };
    isRefresh: boolean;
}

export async function verifyToken(token: string): Promise<CustomJWTPayload | null> {
    try {
        const { payload } = await jwtVerify(token, new TextEncoder().encode(SECRET_KEY));
        return payload as CustomJWTPayload;
    } catch (error) {
        console.error('Token verification failed:', error);
        return null;
    }
}

export function decodeToken(token: string): CustomJWTPayload | null {
    const [, payload] = token.split('.');
    try {
        return JSON.parse(atob(payload)) as CustomJWTPayload;
    } catch (error) {
        console.error('Error parsing JWT payload:', error);
        return null;
    }
}

export function getTokenExpiration(token: string): number | null {
    const decoded = decodeToken(token);
    return decoded?.exp ? decoded.exp * 1000 : null;
}

export function extractRoleFromToken(token: string): string | null {
    const decoded = decodeToken(token);
    return decoded?.user?.roles?.[0] || null;
}

export function getUserStatus(token: string): string | null {
    const decoded = decodeToken(token);
    return decoded?.user?.status || null;
}

export async function getTokenFromCookies() {
    const cookieStore = cookies();
    return cookieStore.get('token')?.value;
}

export async function getCurrentUser(): Promise<CustomJWTPayload | null> {
    const token = await getTokenFromCookies();
    if (!token) return null;
    return verifyToken(token);
}

export function createAxiosInstance(token: string) {
    return axios.create({
        baseURL: process.env.API_BASE_URL || 'http://localhost:8080',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        timeout: 10000, // 10 seconds
    });
}