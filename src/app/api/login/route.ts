import prisma from '../../../../lib/db.config';
import * as bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import * as jwt from 'jsonwebtoken'
import {serialize} from 'cookie'
import { Tulpen_One } from 'next/font/google';

const DEFAULT_EXPIRES_IN = '1d';
const SALT_ROUNDS = 10;
const cookieName = 'token';
const maxAge = 60 * 60 * 24;

export async function POST(request: Request) {

    try{

    }catch{
        
    }
    const body = await request.json();
    const { email, password } = body;

    const user =  await prisma.user.findUnique(
        {
            where:{email}
        }
    )
    if(!user){
        return NextResponse.json({error:'User not found'}, {status: 404});
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(!isPasswordValid){
        return NextResponse.json({error:'Invalid password'}, {status: 401});
    }

    const tokenPayload = {
        userId: user.id,
        email: user.email
    };
    
    const secret = process.env.JWT_SECRET!;
    const expiresIn = process.env.JWT_EXPIRATION || DEFAULT_EXPIRES_IN;
    
    if(!secret){
        throw new Error('JWT secret not found');
    }
    const token = jwt.sign(tokenPayload, secret, {expiresIn : expiresIn as jwt.SignOptions['expiresIn']});


    const serializedCookie = serialize(cookieName, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict' as const,
        maxAge: maxAge,
        path: '/'
    })

    const response = NextResponse.json({message:'Login successful',
        user:{
            id:user.id,
            email:user.email,
        },
        
    }, {status:200});

    response.headers.set('Set-Cookie', serializedCookie);
    return response
}