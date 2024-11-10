import { NextRequest, NextResponse } from 'next/server';
import { createAxiosInstance, getCurrentUser, getTokenFromCookies } from '@/lib/auth';

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const payload = await getCurrentUser();
        if (!payload) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const token = await getTokenFromCookies();
        const api = createAxiosInstance(token);
        const response = await api.delete(`/api/v1/reservations/${params.id}`);
        return NextResponse.json(response.data);
    } catch (error: any) {
        console.error('Error deleting reservation:', error);
        if (error.response?.status === 403) {
            return NextResponse.json({ message: 'User not authorized' }, { status: 403 });
        }
        if (error.response?.status === 404) {
            return NextResponse.json({ message: 'Reservation not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        const payload = await getCurrentUser();
        if (!payload) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const token = await getTokenFromCookies();
        const api = createAxiosInstance(token);
        const response = await api.patch(`/api/v1/reservations/${params.id}`, body);
        return NextResponse.json(response.data);
    } catch (error: any) {
        console.error('Error updating reservation:', error);
        if (error.response?.status === 403) {
            return NextResponse.json({ message: 'User not authorized' }, { status: 403 });
        }
        if (error.response?.status === 404) {
            return NextResponse.json({ message: 'Reservation not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}