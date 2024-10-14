import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const SECRET_KEY = '12345678901234567890123456789012';

interface JWTPayload {
    user: {
        roles: string[];
        [key: string]: any;
    };
    [key: string]: any;
}

export async function getUser(): Promise<JWTPayload | null> {
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) return null;

    try {
        const { payload } = await jwtVerify(token, new TextEncoder().encode(SECRET_KEY));
        return payload as JWTPayload;
    } catch (error) {
        console.error('Failed to verify token:', error);
        return null;
    }
}

export async function isBroker(): Promise<boolean> {
    const cookieStore = cookies();
    const role = cookieStore.get('role')?.value;
    return role === 'broker';
}

export function getTokenExpiration(token: string): number | null {
    const [, payload] = token.split('.');
    try {
        const decodedPayload = JSON.parse(atob(payload));
        return decodedPayload.exp ? decodedPayload.exp * 1000 : null;
    } catch (error) {
        console.error('Error parsing JWT payload:', error);
        return null;
    }
}

export function extractRoleFromToken(token: string): string | null {
    const [, payload] = token.split('.');
    try {
        const decodedPayload = JSON.parse(atob(payload));
        return decodedPayload.user?.roles?.[0] || null;
    } catch (error) {
        console.error('Error parsing JWT payload:', error);
        return null;
    }
}