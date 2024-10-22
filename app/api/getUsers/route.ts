import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { cookies } from 'next/headers';
import { getUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
    try {
        const user = await getUser();

        if (!user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const cookieStore = cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ message: 'Invalid token' }, { status: 402 });
        }

        const axiosInstance = axios.create({
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        const response = await axiosInstance.get(`${process.env.API_BASE_URL}/api/v1/users`);
        return NextResponse.json(response.data);
    } catch (error) {
        console.error('Error fetching users:', error);
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 403) {
                return NextResponse.json({ message: 'User not authorized' }, { status: 403 });
            }
        }
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}