import prisma from '../../../../lib/prisma'
import * as bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken'
import {serialize}  from 'cookie'


const SALT_ROUNDS = 10;

export async function POST(request: Request){
    console.log(" XXXXXXXXXXXXXXXXXXXXXX Registering user... XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX\n\n");
    const body = await request.json();
    const {name, email, password, bio} = body;
    console.log(name, email, password, bio);

    const existingUser = await prisma.user.findUnique({
        where: {
            email: email
        }
    })

    if(existingUser){
        return NextResponse.json({error:'User already exists'}, {status: 400})
    }
    
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    try{
        const newUser = await prisma.user.create({
            data: {
                name: name,
                email: email,
                password: hashedPassword,
                bio: bio
            }
        })

        const tokenPayload = { userId: newUser.id, email: newUser.email };
        const secret = process.env.JWT_SECRET;
        console.log("secret: ", secret);
        const defaultExpiresIn = '1d';
        const expiresIn = process.env.JWT_EXPIRATION|| defaultExpiresIn;
        if(!secret){
            throw new Error('JWT_SECRET is not defined')
        }

        const token = jwt.sign(tokenPayload, secret ,{expiresIn: expiresIn as jwt.SignOptions['expiresIn']});

        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict' as const,
            maxAge: 60 * 60 * 24 * 30,
            path: '/'
        }

        const serializedCookie = serialize('token', token, cookieOptions)


        const response = NextResponse.json({message: 'User created successfully'}, {status: 201});
        response.headers.set('Set-Cookie', serializedCookie);

        return response;
    }
    catch(e){
        return NextResponse.json({error: 'Something went wrong ', e}, {status: 500})
    }
}