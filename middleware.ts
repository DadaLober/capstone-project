import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { getTokenExpiration } from "@/pages/api/utils";

export default async function middleware(req: NextRequest) {
    const res = NextResponse.next();
    // console.log('Request Url:', req.nextUrl.pathname);
    // console.log('Middleware called');

    const tokenCookie = req.cookies.get('token');
    const refreshTokenCookie = req.cookies.get('refreshToken');

    if (tokenCookie === undefined && refreshTokenCookie) {
        const response = await axios.get('http://localhost:8080/refresh', {
            headers: {
                'Cookie': `refreshToken=${refreshTokenCookie.value};`
            }
        }).catch(error => {
            if (axios.isAxiosError(error)) {
                console.error('Error:', error.response?.data);
                console.error('Status:', error.response?.status);
            }
            return error;
        });
        const tokenExpiration = getTokenExpiration(response.data.token) ?? 0;

        //Set cookie 
        res.cookies.set('token', `${response.data.token}`, {
            httpOnly: true,
            path: '/',
            maxAge: Math.floor((tokenExpiration - Date.now()) / 1000),
        });
        return res;
    }

    //If user is not authenticated
    if (!tokenCookie || !refreshTokenCookie) {
        console.log('User is not authenticated. Redirecting to login page.');
        return NextResponse.redirect(new URL('/login', req.url));
    }
    return res;
}

export const config = {
    matcher: [
        '/dashboard(.*)',
        '/test(.*)',
    ]
}