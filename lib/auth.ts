import axios, { AxiosInstance } from 'axios';
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

export async function getRefreshTokenFromCookies() {
    const cookieStore = cookies();
    return cookieStore.get('refreshToken')?.value;
}

export async function getCurrentUser(): Promise<CustomJWTPayload | null> {
    const token = await getRefreshTokenFromCookies();
    if (!token) return null;
    return verifyToken(token);
}

// Keep track of refresh token requests to prevent multiple simultaneous refreshes
let isRefreshing = false;
let failedQueue: Array<{
    resolve: (token: string) => void;
    reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token!);
        }
    });
    failedQueue = [];
};

export function createAxiosInstance(token: string | undefined): AxiosInstance {
    const api = axios.create({
        baseURL: process.env.NEXT_BASE_API_URL,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        timeout: 10000,
    });

    api.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config;

            // If error is not 401 or request has already been retried, reject
            if (error.response?.status !== 403 || originalRequest._retry) {
                return Promise.reject(error);
            }

            if (isRefreshing) {
                // If a refresh is already in progress, queue this request
                try {
                    const newToken = await new Promise<string>((resolve, reject) => {
                        failedQueue.push({ resolve, reject });
                    });
                    originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
                    return api(originalRequest);
                } catch (err) {
                    return Promise.reject(err);
                }
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Attempt to refresh the token
                const refreshTokenCookie = cookies().get('refreshToken');
                if (!refreshTokenCookie) {
                    throw new Error('No refresh token available');
                }

                const response = await axios.get(`${process.env.NEXT_BASE_API_URL}/refresh`, {
                    headers: {
                        'Cookie': `refreshToken=${refreshTokenCookie.value};`
                    }
                });

                const newToken = response.data.token;
                const tokenExpiration = getTokenExpiration(newToken);

                // Update cookies with new token
                if (typeof document !== 'undefined') {
                    document.cookie = `token=${newToken}; path=/; max-age=${tokenExpiration ? Math.floor((tokenExpiration - Date.now()) / 1000) : 3600
                        }; HttpOnly`;
                }

                // Update the failed requests with new token
                processQueue(null, newToken);

                // Update the original request authorization header
                originalRequest.headers['Authorization'] = `Bearer ${newToken}`;

                return api(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }
    );

    return api;
}

export async function refreshAuthToken(refreshToken: string) {
    const response = await axios.post(`${process.env.NEXT_BASE_API_URL}/refresh`, null, {
        headers: {
            'Cookie': `refreshToken=${refreshToken}`
        }
    });
    return response.data.token;
}
