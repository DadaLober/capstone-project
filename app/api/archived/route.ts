import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, getTokenFromCookies, createAxiosInstance } from '@/lib/auth';

export async function GET() {
    try {

        const payload = await getCurrentUser();
        if (!payload) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const token = await getTokenFromCookies();
        const api = createAxiosInstance(token);
        const response = await api.get(`api/v1/archived/properties`);
        return NextResponse.json(response.data);
    } catch (error: any) {
        console.error('Error fetching properties:', error);
        if (error.response?.status === 403) {
            return NextResponse.json({ message: 'Invalid Token' }, { status: 403 });
        }
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}