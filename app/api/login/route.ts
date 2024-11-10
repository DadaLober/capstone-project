import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import axios, { AxiosError } from 'axios';
import { getTokenExpiration } from '@/lib/auth';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const response = await axios.post(`${process.env.NEXT_BASE_API_URL}/login`, body);

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
    } catch (error) {
        if (error instanceof AxiosError && error.response) {
            return NextResponse.json(error.response.data, {
                status: error.response.status,
            });
        }
        return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
    }
}