"use client";
import React, {useState, useEffect} from "react";


import storiesCard from "~/components/storiesCard"
import StoriesCardProps from "~/components/storiesCardProps";

const initialStoriesData: StoriesCardProps[] = [
    {
        "title": "A Brief History of Time Travel",
        "id": 1001,
        "likes": 550,
        "numberOfComments": 28,
        "numberOfContributors": 1,
        "views": 2100
    },
    {
        "title": "10 Essential Tips for Remote Work Productivity",
        "id": 1002,
        "likes": 920,
        "numberOfComments": 95,
        "numberOfContributors": 2,
        "views": 4500
    },
    {
        "title": "Review: Latest Smartphone Model X",
        "id": 1003,
        "likes": 340,
        "numberOfComments": 12,
        "numberOfContributors": 1,
        "views": 1800
    },
    {
        "title": "Building a Decentralized Application (DApp) on Ethereum",
        "id": 1004,
        "likes": 2100,
        "numberOfComments": 180,
        "numberOfContributors": 4,
        "views": 9800
    }
];

export default function Profile() {
    const [sort, setSort] = useState("default");
        // State to hold the displayed (and potentially sorted) list
        const [response, setResponse] = useState<StoriesCardProps[]>([]); 
    
        // 1. Initial Data Load (Fixes Infinite Loop)
        // Runs only once on mount to set the initial response state
        useEffect(() => {
            setResponse(initialStoriesData);
        }, []); 
    
        // 2. Sorting Logic (Fixes Mutation and Switch Fall-through)
        // Removed the 'stories' parameter, as the function now works with
        // a fresh copy of the initial data, ensuring consistent sorting.
        const sortStories = (sortBy: string) => { 
            
            // CRITICAL FIX: Use the spread operator to create a NEW array reference
            let sortedList = [...initialStoriesData]; 
    
            // Update the sort state
            setSort(sortBy); 
    
            switch (sortBy) {
                case "default":
                    // sortedList is already a copy of the initial data
                    break; // CRITICAL FIX: Added break
                case "likes":
                    sortedList.sort((a, b) => b.likes - a.likes);
                    break; // CRITICAL FIX: Added break
                case "comments":
                    sortedList.sort((a, b) => b.numberOfComments - a.numberOfComments);
                    break; // CRITICAL FIX: Added break
                case "contributors":
                    sortedList.sort((a, b) => b.numberOfContributors - a.numberOfContributors);
                    break; // CRITICAL FIX: Added break
                case "views":
                    sortedList.sort((a, b) => b.views - a.views);
                    break; // CRITICAL FIX: Added break
            }
            
            // CRITICAL FIX: setResponse with the new, sorted array
            setResponse(sortedList); 
        }
    return (
        <div>
            <p className="text-4xl font-sans">Your Profile</p> 

            <div className="flex justify-between m-5 items-center">
                
                <div className="flex">

                    <div className="flex mt-5 w-fit border-gray-600 border-2 p-3 rounded-md">
                        <div className="border-black border-1 rounded-full p-1 w-fit bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500">
                            <img src="/bryan.png" alt="" className="h-10 rounded-full"/> 
                        </div>

                        <div className="ml-3">
                            <p className="font-bold text-sm">Bryan</p>
                            <p className="font-extralight text-gray-500 text-sm">2E6BRYAN@example.com</p>

                        </div>
                    </div>
                    
                    <div className="flex items-center ml-5">
                        <button className="bg-red-700 p-2 text-white rounded-md">Edit ✏️</button>
                    </div>
                </div>




                <div className="flex items-center space-x-10 border-black border-2 p-3 rounded-md">
                    <div>
                        <p>🩷</p>
                        <p className="text-blue-500 font-bold">1500</p>
                    </div>
                    <div>
                        <p>💬</p>
                        <p className="text-blue-500 font-bold">200</p>
                    </div>
                    <div>
                        <p>👀</p>
                        <p className="text-blue-500 font-bold">1000</p>
                    </div>
                </div>
            </div>  

            <div className="flex m-5 justify-between">
                <div className="w-1/4 h-fit border-black border-2 rounded-md p-3">
                    <p className="font-bold">Bio</p>
                    <p className="text-xs">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quia.
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quia.
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quia.
                    </p>
                </div>

                <div className="h-lvh border-black border-2 rounded-md overflow-y-auto">
                    <div className="ml-auto m-5 w-fit border-black border-2 rounded-md">
                        <span>sort by: </span>
                        <select 
                        onChange={(e) => sortStories(e.target.value)}
                        className="h-10 ">
                            <option value="default" selected>--default--</option>
                            <option value="likes" className="h-8 bg-red-600">Likes</option>
                            <option value="contributors"className="h-8 bg-orange-600">Contributors</option>
                            <option value="views"className="h-8 bg-green-600">Views</option>
                        </select>
                    </div>
                    {response.map((story) => storiesCard({stories: story})) }
                </div>
            </div>
        </div>
    )
}