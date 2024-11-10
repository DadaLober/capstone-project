import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { cookies } from 'next/headers';

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string; fileId: string } }
) {
    try {
        const cookieStore = cookies();
        const token = cookieStore.get('token')?.value;

        console.log("params", params)
        if (!token) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const axiosInstance = axios.create({
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        const response = await axiosInstance.delete(`${process.env.NEXT_BASE_API_URL}/api/v1/properties/${params.id}/files/${params.fileId}`);
        return NextResponse.json(response.data);
    } catch (error) {
        console.error('Error deleting file:', error);
        if (axios.isAxiosError(error)) {
            switch (error.response?.status) {
                case 403:
                    return NextResponse.json({ message: 'User not authorized' }, { status: 403 });
                case 404:
                    return NextResponse.json({ message: 'File not found' }, { status: 404 });
                default:
                    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
            }
        }
        return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
    }
}