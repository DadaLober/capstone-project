import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { cookies } from 'next/headers';
import { createAxiosInstance, getCurrentUser, getTokenFromCookies } from '@/lib/auth';

export async function GET() {
    try {
        const payload = await getCurrentUser();
        if (!payload) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const token = await getTokenFromCookies();
        const api = createAxiosInstance(token);
        const response = await api.get('/api/v1/reservations');
        return NextResponse.json(response.data);
    } catch (error: any) {
        console.error('Error fetching reservations:', error);
        if (error.response?.status === 403) {
            return NextResponse.json({ message: 'User not authorized' }, { status: 403 });
        }
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const cookieStore = cookies();
        const token = cookieStore.get('token')?.value;
        const refreshToken = cookieStore.get('refreshToken')?.value;

        if (!token || !refreshToken) {
            return NextResponse.json({ message: 'Invalid cookie format' }, { status: 401 });
        }

        const body = await request.json();
        console.log(body)
        const { propertyId, userId, reservationDate } = body;

        const axiosInstance = axios.create({
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        const reservationData = {
            propertyId,
            userId: userId,
            fee: 100.00,
            expiresAt: reservationDate,
        };

        const response = await axiosInstance.post(`${process.env.NEXT_BASE_API_URL}/api/v1/reservations`, reservationData);

        console.log("Server response:", response.data);
        return NextResponse.json(response.data);
    } catch (error) {
        console.error("Error in reservation API:", error);
        if (axios.isAxiosError(error)) {
            switch (error.response?.status) {
                case 403:
                    return NextResponse.json({ message: 'User not authorized' }, { status: 403 });
                default:
                    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
            }
        }
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}