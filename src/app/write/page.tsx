"use client";

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation"; // 1. Import useRouter

// Remove 'async' from the client component function
export default function Write() {
    const [title, setTitle] = useState("");
    const [genre, setGenre] = useState("");
    const [fiction, setFiction] = useState(false);
    const [contribute, setContribute] = useState(false);
    const [nsfw, setNsfw] = useState(false);
    const [isLoading, setIsLoading] = useState(false); 

    const router = useRouter(); // 2. Initialize the router

    const handleSubmit = async () => {
        // Basic validation
        if (!title || !genre) {
            alert("Title and Genre are required.");
            return;
        }

        setIsLoading(true);

        const payload = {
            title: title,
            // The content should be initialized with placeholder markdown.
            content: `## Start Your Story Here\n\nThis is **bold** text and this is *italic* text.\n\n- Use lists\n- To organize ideas\n\n---`,
            category: genre,
            fiction: fiction,
            nsfw: nsfw,
            // Include contribute in the payload if your API handles it
            contribute: contribute,
        };

        try {
            // 3. POST the story configuration data to the server
            const response = await axios.post('/api/story', payload);

            // ASSUMPTION: The server's API ('/api/story') responds with the newly created story object,
            // which MUST include the unique ID (e.g., response.data.id).
            const newStoryId = response.data.id; 

            if (newStoryId) {
                // 4. Redirect the user to the editing path using the actual ID
                router.push(`/write/${newStoryId}`);
                
                // Note: The loading state will stop updating as the user is navigating away.
            } else {
                // Handle case where API succeeds but doesn't return the ID properly
                throw new Error("Story created but failed to retrieve unique ID.");
            }

        } catch (e) {
            console.error("Error submitting story:", e);
            alert("Failed to start writing. Please try again.");
            setIsLoading(false); // Stop loading on failure
        }
    };

    return (
        <div className="flex flex-col items-center">
            {/* basic questions */}
            <div className="flex flex-col space-y-5 bg-slate-200 w-fit ml-auto mr-auto p-5 m-5 rounded-md">

                {/* Title Input */}
                <div className="flex items-center space-x-2">
                    <span>Title: </span>
                    <input 
                        onChange={(e) => setTitle(e.target.value)}
                        type="text" 
                        value={title}
                        className="border-black border-2 p-2 rounded-md"
                    />
                </div>

                {/* Genre Dropdown */}
                <div className="flex items-center space-x-2">
                    <span>Genre: </span>
                    <select
                        onChange={(e) => setGenre(e.target.value)}
                        value={genre}
                        className="border-black border-2 p-2 rounded-md"
                    >
                        <option value="">-- Select a genre --</option>
                        <option value="fan-fiction">fan-fiction</option>
                        <option value="thriller">thriller</option>
                        <option value="romantic">romantic</option>
                        <option value="action">action</option>
                        <option value="NSFW">NSFW(only 18+ can view)</option>
                    </select>
                </div>

                {/* Fiction Checkbox */}
                <div className="flex items-center space-x-2">
                    <span>Fiction</span>
                    <input 
                        onChange={(e) => setFiction(e.target.checked)}
                        type="checkbox"
                        checked={fiction}
                    /> 
                </div>

                {/* Contribute Checkbox */}
                <div className="flex items-center space-x-2">
                    <span>Other can contribute?</span>
                    <input 
                        onChange={(e) => setContribute(e.target.checked)}
                        type="checkbox"
                        checked={contribute}
                    /> 
                </div>
                 {/* NSFW Checkbox */}
                <div className="flex items-center space-x-2">
                    <span>NSFW?</span>
                    <input 
                        onChange={(e) => setNsfw(e.target.checked)}
                        type="checkbox"
                        checked={nsfw}
                    /> 
                </div>
            </div>
            
            {/* The button now handles the submission and redirection */}
            <button 
                onClick={handleSubmit} 
                disabled={isLoading || !title || !genre} // Disable if loading or required fields are empty
                className="border-black border-2 p-2 bg-red-800 rounded-lg text-white disabled:opacity-50"
            >
                {isLoading ? "Creating Story..." : "Start writing"}
            </button>

        </div>
    )
}