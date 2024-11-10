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

        const response = await axiosInstance.patch(`${process.env.NEXT_BASE_API_URL}/api/v1/properties/${params.id}`, body);
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

        const response = await axiosInstance.delete(`${process.env.NEXT_BASE_API_URL}/api/v1/properties/${params.id}`);
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

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const cookieStore = cookies();
        const token = cookieStore.get('token')?.value;
        const refreshToken = cookieStore.get('refreshToken')?.value;

        if (token && refreshToken) {
            const axiosInstance = axios.create({
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const response = await axiosInstance.get(`${process.env.NEXT_BASE_API_URL}/api/v1/properties/${params.id}/files`);
            const fileData = Array.isArray(response.data) ? response.data.map(file => ({
                ...file,
                imageUrl: `${process.env.NEXT_BASE_API_URL}/assets/${file.uri}`
            })) : [];
            return NextResponse.json(fileData);
        }

        return NextResponse.json({ message: 'Invalid cookie format' }, { status: 401 });
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 400) {
                return NextResponse.json({ message: 'Property does not exist' }, { status: 400 });
            }
            if (error.response?.status === 403) {
                return NextResponse.json({ message: 'User not authorized' }, { status: 403 });
            }
        }
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;
    const refreshToken = cookieStore.get('refreshToken')?.value;

    if (!token || !refreshToken) {
        return NextResponse.json({ message: 'Invalid cookie format' }, { status: 401 });
    }

    const formData = await request.formData();

    const axiosInstance = axios.create({
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    try {
        await axiosInstance.post(
            `${process.env.NEXT_BASE_API_URL}/api/v1/properties/${params.id}/upload`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );

        return NextResponse.json({ message: 'File uploaded successfully' });
    } catch (error) {
        console.error('Error uploading file:', error);
        return NextResponse.json({ message: 'Error uploading file' }, { status: 500 });
    }
}