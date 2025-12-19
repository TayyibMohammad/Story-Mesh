// /middleware.ts (Enhanced Version)

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import * as jwt from "jsonwebtoken";

const PROTECTED_PAGES = [
    '/profile',
]

// 💡 New list for API routes that require authentication
const PROTECTED_APIS = [
    '/api/story', 
    // Add other API endpoints like /api/user, /api/comment, etc.
]

const LOGIN_URL = '/signin';

export async function middleware(request: NextRequest){
    const url = request.nextUrl.clone();
    
    const isProtectedPage = PROTECTED_PAGES.some((route) => url.pathname.startsWith(route));
    const isProtectedApi = PROTECTED_APIS.some((route) => url.pathname.startsWith(route));

    // Combine checks: If it's a page or an API that requires authentication
    if(isProtectedPage || isProtectedApi){ 
        const token = request.cookies.get('token')?.value;

        // --- 1. No Token Check ---
        if(!token){
            if (isProtectedApi) {
                // For API, return a 401 JSON error
                return NextResponse.json({ success: false, message: 'Authentication required.' }, { status: 401 });
            }
            // For pages, redirect to login
            url.pathname = LOGIN_URL;
            return NextResponse.redirect(url);
        }

        let payload: { userId: number; email: string };
        try{
            const secret = process.env.JWT_SECRET;
            if(!secret){
                throw new Error('JWT secret not found');
            }
            // 💡 Ensure payload.userId is an Int if you use it as an Int in Prisma
            payload = jwt.verify(token, secret) as {userId: number, email: string}; 
            
            // --- 2. Pass userId securely via Request Headers ---
            // We need to clone the request to modify headers
            const requestHeaders = new Headers(request.headers);
            requestHeaders.set('x-user-id', payload.userId.toString());
            
            // For API Routes, we just pass the new request object
            if (isProtectedApi) {
                 return NextResponse.next({
                    request: {
                        headers: requestHeaders,
                    },
                });
            }

            // For Page Routes, you can use headers or search params. 
            // Using search params for pages is often for SSR/SSG.
            // Let's stick to returning a new request with headers for consistency.
            return NextResponse.next({
                request: {
                    headers: requestHeaders,
                },
            });
            
        }catch(error){
            console.error('JWT Verification Error:', error);
            
            // --- 3. Verification Fail Check ---
            if (isProtectedApi) {
                // For API, return 403 Forbidden/Invalid token
                return NextResponse.json({ success: false, message: 'Invalid or expired token.' }, { status: 403 });
            }

            // For pages, redirect to login and clear the bad cookie
            url.pathname = LOGIN_URL;
            const response =  NextResponse.redirect(url);
            response.cookies.delete('token');
            return response
        }
    }

    return NextResponse.next();
}

export const config = {
    // 🛑 FIX: Extend matcher to include all routes under /api/story/
    matcher: [
        '/profile/:path*',
        '/api/story/:path*',
    ]
}

