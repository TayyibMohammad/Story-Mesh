"use client";

import React, { useState } from "react";
import axios from 'axios';
import Link from "next/link";
import { AxiosError } from 'axios'; // Import AxiosError for type safety

export default function AuthForm({ isSignIn }: { isSignIn: boolean }) {
    
    // Input States
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [bio, setBio] = useState('');

    // Feedback States
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); 
        
        if (isSignIn) { 
            // In a complete app, you would handle Sign In logic here
            setMessage('Sign In logic not yet implemented.'); 
            return; 
        }

        if (isLoading) return;
        setIsLoading(true);
        
        // Reset feedback before submission
        setMessage(''); 
        setIsError(false);
        
        const data = { name, email, password, bio };
        let finalLogMessage = ''; 

        try {
            console.log(10001)
            const res = await axios.post('/api/register', data);
            console.log(20000)
            console.log(res);
            const successMsg = res.data.message || 'Registration successful!';
            setMessage(successMsg);
            finalLogMessage = successMsg;
            
            // OPTIONAL: Redirect the user after successful registration
            // router.push('/dashboard'); 
            
        } catch (error: unknown) {
            console.log(30000)
            setIsError(true);
            let errorMsg = 'An unexpected error occurred.';
            
            // Type Guard: Safely check for Axios error structure
            if (axios.isAxiosError(error) && error.response) {
                // Use the error message sent from the backend
                if (error.response.data && error.response.data.error) {
                    errorMsg = error.response.data.error;
                } else if (error.response.status === 500) {
                    errorMsg = `Server Error (${error.response.status}). Check backend console.`;
                }
            }
            
            setMessage(errorMsg);
            finalLogMessage = errorMsg;
            
        } finally {
            setIsLoading(false);
            console.log("Submission Complete:", finalLogMessage); 
        }
    }
    
    return (
        <form 
            onSubmit={handleSubmit}
            className="space-y-4 flex flex-col items-center ml-auto mr-auto bg-zinc-300 w-fit p-5 m-5 rounded-md"
        >
            <h2 className="text-xl font-bold">{isSignIn ? "Sign In" : "Sign Up"}</h2>
            
            {/* Feedback Message Display */}
            {message && (
                <div className={`p-2 rounded-md ${isError ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'}`}>
                    {message}
                </div>
            )}

            <div className="space-y-5">
                {/* Username Input (Only for Sign Up) */}
                {!isSignIn && (
                    <div>
                        <p>Username</p>
                        <input 
                        onChange={(e) => setName(e.target.value)}
                        type="text" 
                        className="border-black border-2 p-2 rounded-md" 
                        required
                        />
                    </div>
                )}
                
                {/* Bio Input (Only for Sign Up) */}
                {!isSignIn && (
                    <div>
                        <p>Bio</p>
                        <textarea 
                        onChange={(e) => setBio(e.target.value)}
                        className="border-black border-2 p-2 rounded-md" 
                        />
                    </div>
                )}
                
                {/* Email Input */}
                <div>
                    <p>Email</p>
                    <input 
                    onChange={(e) => setEmail(e.target.value)}        
                    type="email" 
                    className="border-black border-2 p-2 rounded-md"
                    required
                    />
                </div>
                
                {/* Password Input */}
                <div>
                    <p>Password</p>
                    <input 
                    onChange={(e) => setPassword(e.target.value)}
                    type="password" 
                    className="border-black border-2 p-2 rounded-md"
                    required
                    />
                </div>
            </div>

            <button 
            type="submit" 
            disabled={isLoading}
            className="border-black border-2 p-2 bg-red-800 rounded-lg text-white disabled:bg-red-400">
                {isLoading ? 'Processing...' : `Sign ${isSignIn ? "In" : "Up"}`}
            </button>
            
            <Link href={isSignIn ? "/signup" : "/signin"}>
                <p className = "text-blue-500">{isSignIn ? "Create an account" : "Already have an account?"}</p>
            </Link>
        </form>
    )
}