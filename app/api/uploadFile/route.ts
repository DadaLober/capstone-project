import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { cookies } from 'next/headers';


export async function POST(request: NextRequest) {
    const id = request.nextUrl.searchParams.get('id');
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof Blob)) {
        return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
    }

    const axiosInstance = axios.create({
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    try {
        const buffer = await file.arrayBuffer();
        const blob = new Blob([buffer]);
        const formDataToSend = new FormData();
        formDataToSend.append('file', blob, (file as File).name);

        await axiosInstance.post(`http://localhost:8080/api/v1/properties/${id}/upload`, formDataToSend, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return NextResponse.json({ message: 'File uploaded successfully' });
    } catch (error) {
        console.error('Error uploading file:', error);
        return NextResponse.json({ message: 'Error uploading file' }, { status: 500 });
    }
}