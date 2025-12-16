import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server';
// Assuming this type definition file exists
import StoriesCardProps from '~/components/storiesCardProps'; 

// --- HELPER FUNCTIONS (Middleware & Validation) ---

/**
 * Reads the authenticated userId from the 'x-user-id' header set by the middleware.
 * @param request The incoming Request object.
 * @returns The authenticated user's ID (number).
 */
function getUserIdFromRequest(request: Request): number {
    const userIdHeader = request.headers.get('x-user-id');
    
    if (!userIdHeader) {
        // This indicates a critical middleware configuration error if reached on a protected route
        throw new Error("Authentication failed: User ID header missing.");
    }
    
    const userId = parseInt(userIdHeader, 10);
    if (isNaN(userId)) {
        throw new Error("Authentication failed: Invalid User ID format.");
    }
    return userId;
}

interface StoryRequestBody {
    title: string;
    content: string;
    category: string;
    fiction?: boolean; // Optional, defaults to false in schema
    nsfw?: boolean;    // Optional, defaults to false in schema
}

/**
 * Helper function to validate the story creation body.
 * @param body The parsed JSON request body.
 * @returns An array of missing or invalid field names.
 */
const validateStoryBody = (body: any): string[] => {
    const missingFields: string[] = [];

    // Required fields check
    if (!body.title || typeof body.title !== 'string' || body.title.trim() === '') {
        missingFields.push('title');
    }
    if (!body.content || typeof body.content !== 'string' || body.content.trim() === '') {
        missingFields.push('content');
    }
    if (!body.category || typeof body.category !== 'string' || body.category.trim() === '') {
        missingFields.push('category');
    }

    // Optional boolean fields type check
    if (body.fiction !== undefined && typeof body.fiction !== 'boolean') {
         missingFields.push('fiction (must be boolean)');
    }
    if (body.nsfw !== undefined && typeof body.nsfw !== 'boolean') {
         missingFields.push('nsfw (must be boolean)');
    }

    return missingFields;
};


// --- GET (List Stories) ---
export async function GET(request: Request) {
    prisma.comment
    try{
        const stories = await prisma.story.findMany({
            include: {
                comments: true,
                liked: true,        // 🛑 FIX: Correct relation name is 'liked'
                contributors: true,
            },
        });

        // Map over the array of stories to create a simplified, processed response array
        const responseData : StoriesCardProps[]= stories.map((story: any)=> ({
            id: story.id,
            title: story.title,
            
            // 🛑 FIX: Use the property names required by StoriesCardProps
            numberOfComments: story.comments.length,     // Was commentCount
            likes: story.liked.length,                   // Was likeCount, and is the count, not the user array
            numberOfContributors: story.contributors.length, // Was contributorCount
            
            // 🛑 FIX: Add the missing 'views' property (initializing to 0 as it's not in the schema)
            views: 0, 
            
            // NOTE: You are also missing 'likes' which I've fixed above. 
            // If the 'likes' field in StoriesCardProps expects an array of user IDs, 
            // the fix below is DIFFERENT (see the note).
        }));
        return NextResponse.json(responseData);
    }catch(e){
        return NextResponse.json({error: 'Something went wrong', details: e}, {status:500})
    }
    
}

// --- POST (Create Story) ---
export async function POST(request: Request){

    try{
        // 1. Get authenticated user ID from middleware-set header
        const authorId = getUserIdFromRequest(request); 

        const body = await request.json();
        
        // 2. Validate request body
        const missingFields = validateStoryBody(body); 
        if (missingFields.length > 0) {
            return NextResponse.json(
                { 
                    error: 'Validation Failed', 
                    message: `Missing or invalid fields: ${missingFields.join(', ')}` 
                }, 
                { status: 400 } // Bad Request
            );
        }

        const {
            title,
            content,
            category,
            fiction,
            nsfw
        } = body as StoryRequestBody; // Cast to use IntelliSense

        // 3. Create the story
        const newStory = await prisma.story.create({
            data: {
                title: title,
                content: content,
                category: category,
                // Use default values from schema if fields are not provided or nullish
                fiction: fiction ?? false, 
                nsfw: nsfw ?? false,
                // 🛑 FIX: Link the story via the foreign key
                authorId: authorId, 
            }
        })

        return NextResponse.json({message: "Story added", story: newStory});

    }catch(e){
        // Log the error for debugging
        console.error('POST Error:', e); 
        return NextResponse.json({error: 'Something went wrong', details: e}, {status: 500})
    }
}

// --- PUT (Update Story/Interactions: Like, Comment, Contribute) ---
export async function PUT(request: Request){
    const req = await request.json();
    const {type, data} = req;

    try{
        // 1. Get authenticated user ID from middleware-set header
        const userId = getUserIdFromRequest(request); 

        // Basic validation for story ID
        if (!data.id || typeof data.id !== 'number') {
            return NextResponse.json({ error: 'Story ID is required and must be a number.' }, { status: 400 });
        }

        if(type==='like'){
            // 🛑 FIX: Use 'connect' to establish the Many-to-Many relation.
            await prisma.story.update({
                where: { id: data.id },
                data: {
                    liked: { // Correct relation name
                        connect: { id: userId }
                    }
                }
            })
            return NextResponse.json({message: 'Story liked successfully'})
        }
        else if(type==='comment'){
            // Basic validation for comment content
            if (!data.comment || typeof data.comment !== 'string' || data.comment.trim().length === 0) {
                 return NextResponse.json({ error: 'Comment content is required.' }, { status: 400 });
            }

            // 🛑 FIX: Create the Comment and link it via the FK fields.
            const newComment = await prisma.comment.create({
                data: {
                    content: data.comment, 
                    authorId: userId, // Link to the authenticated User
                    storyId: data.id, // Link to the target Story
                }
            })
            return NextResponse.json({message: 'Comment added successfully', comment: newComment})
        }
        else if(type === 'contribute'){
             // Basic validation for contribution content
            if (!data.contribution || typeof data.contribution !== 'string' || data.contribution.trim().length === 0) {
                 return NextResponse.json({ error: 'Contribution content is required.' }, { status: 400 });
            }

            const currentStory:any = await prisma.story.findUnique({
                where: { id: data.id },
                select: { content: true } // Only retrieve the content field
            });

            if (!currentStory) {
                return NextResponse.json({ error: 'Story not found.' }, { status: 404 });
            }
            
            const newContribution = `\n\n--- Contribution by User ${userId} ---\n${data.contribution}`;
            const newContent = currentStory.content + newContribution;

            // 🛑 FIX: Use 'connect' for Many-to-Many and 'append' for content.
            await prisma.story.update({
                where: { id: data.id },
                data: {
                    // Append the new contribution
                    content: {
                        set: newContent
                    },
                    // Connect the User to the 'contributors' relation
                    contributors: { 
                        connect: { id: userId }
                    }
                }
            })
            return NextResponse.json({message: 'Contribution added successfully'})
        } else {
             return NextResponse.json({error: `Invalid action type provided: ${type}`}, {status: 400})
        }
    }catch(e){
        console.error('PUT Error:', e);
        return NextResponse.json({error: 'Something went wrong', details: e}, {status: 500})
    }
    
}