import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
    try {
        const payload = await getCurrentUser();

        if (!payload) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { user } = payload;
        return NextResponse.json(user);
    } catch (error) {
        console.error('Error fetching user info:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
