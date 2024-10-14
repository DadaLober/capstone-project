import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { cookies } from 'next/headers';

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        console.log('Request body:', body);

        const cookieStore = cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const axiosInstance = axios.create({
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        const response = await axiosInstance.patch(`http://localhost:8080/api/v1/properties/${params.id}`, body);
        console.log("Server response:", response.data);
        return NextResponse.json(response.data);
    } catch (error) {
        console.error('Error updating property:', error);
        if (axios.isAxiosError(error)) {
            switch (error.response?.status) {
                case 403:
                    return NextResponse.json({ message: 'User not authorized' }, { status: 403 });
                case 404:
                    return NextResponse.json({ message: 'Property not found' }, { status: 404 });
                default:
                    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
            }
        }
        return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const cookieStore = cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const axiosInstance = axios.create({
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        const response = await axiosInstance.delete(`http://localhost:8080/api/v1/properties/${params.id}`);
        return NextResponse.json(response.data);
    } catch (error) {
        console.error('Error deleting property:', error);
        if (axios.isAxiosError(error)) {
            switch (error.response?.status) {
                case 403:
                    return NextResponse.json({ message: 'User not authorized' }, { status: 403 });
                case 404:
                    return NextResponse.json({ message: 'Property not found' }, { status: 404 });
                default:
                    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
            }
        }
        return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
    }
}