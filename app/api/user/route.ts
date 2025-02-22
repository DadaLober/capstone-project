import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import axios from 'axios';
import { jwtVerify } from 'jose';

const SECRET_KEY = '12345678901234567890123456789012';

export async function GET(request: NextRequest) {
    try {
        const cookieStore = cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { payload } = await jwtVerify(token, new TextEncoder().encode(SECRET_KEY));
        const userInfo = payload.user as {
            id: number;
            firstName: string;
            lastName: string;
            contactNumber: string;
            email: string;
            role: string;
            status: string;
        };

        return NextResponse.json(userInfo);
    } catch (error) {
        console.error('Error fetching user info:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}


export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const { id, action } = body;
        const cookieStore = cookies();
        const token = cookieStore.get('token')?.value;
        const refreshToken = cookieStore.get('refreshToken')?.value;

        if (token && refreshToken) {
            const axiosInstance = axios.create({
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            let response;
            if (action === 'add-broker') {
                response = await axiosInstance.patch(`${process.env.NEXT_BASE_API_URL}/api/v1/users/${id}`, { role: 'broker' });
            } else {
                const status = action === 'suspend' ? 'suspended' : 'active';
                response = await axiosInstance.patch(`${process.env.NEXT_BASE_API_URL}/api/v1/users/${id}`, { status });
            }

            return NextResponse.json(response.data);
        }

        return NextResponse.json({ message: 'Invalid cookie format' }, { status: 401 });
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 403) {
                return NextResponse.json({ message: 'User not authorized' }, { status: 403 });
            }
        }
        console.error('Error updating user:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
