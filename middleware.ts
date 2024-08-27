import { NextRequest, NextResponse } from "next/server";

export default function middleware(req: NextRequest) {
    console.log('Request Url:', req.nextUrl.pathname);
    console.log('Middleware called');

    const tokenCookie = req.cookies.get('token');
    // console.log('Token Cookie:', tokenCookie);

    const refreshTokenCookie = req.cookies.get('refreshToken');
    // console.log('Refresh Token Cookie:', refreshTokenCookie);

    if (!tokenCookie || !refreshTokenCookie) {
        console.log('User is not authenticated. Redirecting to login page.');
        return NextResponse.redirect(new URL('/login', req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/dashboard(.*)',
    ]
}
