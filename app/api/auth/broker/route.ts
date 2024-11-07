import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
    const payload = await getCurrentUser();
    const isBroker = payload?.user.roles.includes('broker') ?? false;
    return NextResponse.json({ isBroker });
}