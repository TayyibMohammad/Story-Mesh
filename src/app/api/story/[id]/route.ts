import prisma from '../../../../../lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { id: string } }) {
    
    const storyId = params.id;  

    try{
        const story = await prisma.story.findUnique({
            where: {
                id: parseInt(storyId)
            }
        });

        if(!story){
            return NextResponse.json({message: 'Story not found'}, {status: 404});
        }
        const responseData = {
            id: story.id,
            category: story.category,
            fiction: story.fiction,
            content: story.content            
        };
        return NextResponse.json(responseData);
    }catch(e){
        return NextResponse.json({error: 'Something went wrong', e}, {status:500})
    }


}