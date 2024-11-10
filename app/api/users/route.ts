import axios from "axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;
    const refreshToken = cookieStore.get('refreshToken')?.value;

    if (!token || !refreshToken) {
        return NextResponse.json({ message: 'Invalid cookie format' }, { status: 401 });
    }

    const axiosInstance = axios.create({
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    try {
        const response = await axiosInstance.get(`${process.env.NEXT_BASE_API_URL}/api/v1/users`);
        return NextResponse.json(response.data);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 403) {
                return NextResponse.json({ message: 'User not authorized' }, { status: 403 });
            }
        }
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}