import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import * as jwt from "jsonwebtoken";

const PROTECTED_ROUTES = [
    '/profile',
]

const LOGIN_URL = '/signin';

export async function middleware(request:NextRequest){
    const url = request.nextUrl.clone();

    const isProtectedRoute = PROTECTED_ROUTES.some((route) => url.pathname.startsWith(route));
    
    if(isProtectedRoute){
        const token = request.cookies.get('token')?.value;
        if(!token){
            url.pathname = LOGIN_URL;
            return NextResponse.redirect(url);
        }
        try{
            const secret = process.env.JWT_SECRET;
            if(!secret){
                throw new Error('JWT secret not found')
            }
            const payload = jwt.verify(token, secret) as {userId: string, email: string};
            url.searchParams.set('userId', payload.userId);
        }catch(error){
            console.error('JWT Verification Error:', error);
            url.pathname = LOGIN_URL;
            const response =  NextResponse.redirect(url);
            response.cookies.delete('token');
            return response
        }

    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/profile/:path*'
    ]
}

