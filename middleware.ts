import { NextRequest, NextResponse } from "next/server";

export default function middleware(req: NextRequest) {
    console.log('Request Url:', req.nextUrl.pathname);
    console.log('Middleware called');
    return NextResponse.next();
}

export const config = {
    matcher: [
        '/',
        '/test',
        '/api/(.*)',
        '/dashboard/(.*)',
    ]
}
