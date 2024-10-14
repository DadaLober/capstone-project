import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import axios from 'axios';
import { getTokenExpiration } from '@/lib/auth';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const response = await axios.post('http://localhost:8080/login', body);

        const { token, refreshToken } = response.data;

        const tokenExpiry = getTokenExpiration(token);
        const refreshTokenExpiry = getTokenExpiration(refreshToken);

        if (!tokenExpiry || !refreshTokenExpiry) {
            throw new Error('Unable to extract token expiration');
        }

        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict' as const,
        };

        const cookieStore = cookies();
        cookieStore.set('token', token, { ...cookieOptions, maxAge: Math.floor((tokenExpiry - Date.now()) / 1000) });
        cookieStore.set('refreshToken', refreshToken, { ...cookieOptions, maxAge: Math.floor((refreshTokenExpiry - Date.now()) / 1000) });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Login error:', error);
        return NextResponse.json(
            { message: error.response?.data?.message || 'Internal Server Error' },
            { status: error.response?.status || 500 }
        );
    }
}