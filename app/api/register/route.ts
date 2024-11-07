import { NextRequest, NextResponse } from 'next/server';
import axios, { AxiosError } from 'axios';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const response = await axios.post('http://localhost:8080/register', body);
        return NextResponse.json(response.data);
    } catch (error) {
        if (error instanceof AxiosError && error.response) {
            return NextResponse.json(error.response.data, {
                status: error.response.status,
            });
        }
    }
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
}