"use client";

import React, {useState, useEffect} from "react";
import axios from "axios";

import storiesCard from "~/components/storiesCard"
import StoriesCardProps from "~/components/storiesCardProps"

const storiesData : StoriesCardProps[] = await axios.get('api/story')

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

export default function Stories() {

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
        <div className="flex flex-col items-center">
            <div className="ml-auto m-5 border-black border-2 rounded-sm">
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
    )
}