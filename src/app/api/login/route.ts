import prisma from '../../../../lib/prisma';
import * as bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import * as jwt from 'jsonwebtoken'
import { serialize } from 'cookie'

const DEFAULT_EXPIRES_IN = '1d';
const cookieName = 'token';
const maxAge = 60 * 60 * 24; // 1 day in seconds

interface TokenPayload {
    userId: Number;
    email: string;
}

export async function POST(request: Request) {
    try {
        // 1. Get and parse request body
        const body = await request.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json({ error: 'Missing email or password' }, { status: 400 });
        }

        // 2. Find user by email
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 }); // Use 401 to prevent enumeration
        }

        // 3. Validate password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 }); // Use 401
        }

        // 4. Create JWT
        const tokenPayload: TokenPayload = {
            userId: user.id,
            email: user.email
        };

        const secret = process.env.JWT_SECRET;
        const expiresIn = process.env.JWT_EXPIRATION || DEFAULT_EXPIRES_IN;

        if (!secret) {
            // Log this internally and return a generic error
            console.error('FATAL: JWT_SECRET environment variable not set.');
            return NextResponse.json({ error: 'Internal server configuration error' }, { status: 500 });
        }

        const token = jwt.sign(
            tokenPayload, 
            secret, 
            { expiresIn: expiresIn as jwt.SignOptions['expiresIn'] }
        );

        // 5. Serialize cookie
        const serializedCookie = serialize(cookieName, token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict' as const,
            maxAge: maxAge,
            path: '/'
        });

        // 6. Send response
        const response = NextResponse.json({
            message: 'Login successful',
            user: {
                id: user.id,
                email: user.email,
            },
        }, { status: 200 });

        response.headers.set('Set-Cookie', serializedCookie);
        return response;

    } catch (error) {
        // Catch all unexpected errors (JSON parsing, DB connection, etc.)
        console.error('An unexpected error occurred during login process:', error);
        
        return NextResponse.json(
            { error: 'An unexpected server error occurred.' }, 
            { status: 500 }
        );
    }
}