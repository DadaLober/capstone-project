import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
    try {
        const user = await getUser();

        if (!user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { roles, ...userInfo } = user.user;

        return NextResponse.json({
            ...userInfo,
            role: roles[0],
        });
    } catch (error) {
        console.error('Error fetching user info:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}