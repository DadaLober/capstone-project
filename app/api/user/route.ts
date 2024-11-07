import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
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
        const { roles, ...userInfo } = payload.user as { roles: string[], [key: string]: any };

        return NextResponse.json({
            ...userInfo,
            role: roles[0],
        });
    } catch (error) {
        console.error('Error fetching user info:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}