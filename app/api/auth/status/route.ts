import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
    const payload = await getCurrentUser();
    const status = payload?.user.status ?? null;
    return NextResponse.json({ status });
}