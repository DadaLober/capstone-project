import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { getTokenExpiration } from "./lib/auth";


export default async function middleware(req: NextRequest) {
    const res = NextResponse.next();
    const tokenCookie = req.cookies.get('token');
    const refreshTokenCookie = req.cookies.get('refreshToken');

    if (tokenCookie === undefined && refreshTokenCookie) {
        try {
            const response = await axios.get(`${process.env.NEXT_BASE_API_URL}/refresh`, {
                headers: {
                    'Cookie': `refreshToken=${refreshTokenCookie.value};`
                }
            });
            const tokenExpiration = getTokenExpiration(response.data.token) ?? 0;
            //Set cookie 
            res.cookies.set('token', `${response.data.token}`, {
                httpOnly: true,
                path: '/',
                maxAge: Math.floor((tokenExpiration - Date.now()) / 1000),
            });
            return res;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Error:', error.response?.data);
                console.error('Status:', error.response?.status);
            }
        }
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