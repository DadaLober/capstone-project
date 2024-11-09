import { NextResponse } from 'next/server';
import axios from 'axios';
import { cookies } from 'next/headers';

export async function GET() {
    try {
        const cookieStore = cookies();
        const token = cookieStore.get('token')?.value;
        const refreshToken = cookieStore.get('refreshToken')?.value;

        // Remove cookie from backend
        const response = await axios.get('http://localhost:8080/logout', {
            headers: {
                'Cookie': `token=${token}; refreshToken=${refreshToken}`
            }
        });

        if (response.status === 200) {
            const response = NextResponse.json({ message: 'Logout successful' });

            // Clear cookies
            response.cookies.set('token', '', { maxAge: 0 });
            response.cookies.set('refreshToken', '', { maxAge: 0 });
            response.cookies.set('role', '', { maxAge: 0 });

            return response;
        }

        return NextResponse.json({ message: 'Logout failed' }, { status: 400 });
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return NextResponse.json({ message: error.response?.data }, { status: 401 });
        }
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
