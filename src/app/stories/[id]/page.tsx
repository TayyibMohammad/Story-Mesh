import {use} from "react";

import StoriesDetailsProps from "~/components/storiesDetailProp";
import StoriesDetails from "~/components/storiesDetail";
import axios from "axios";

interface StoryProps {
  params: Promise<{
    id: string;
  }>;
}



// replace with actual api call.
const initialData: StoriesDetailsProps[] = [
    {
        "id": 1001,
        "category": "Science/Speculation",
        "fiction": false,
        "content": "This analytical piece explores the immense logistical and financial hurdles of establishing colonies beyond our solar system. We calculate the energy requirements for launching resource payloads and discuss the concept of self-sustaining ecosystems in extraterrestrial environments, challenging optimistic projections with hard physics and economic reality. The article concludes with a look at resource scarcity models in deep space."
    },
    {
        "id": 1002,
        "category": "Technology/Coding",
        "fiction": false,
        "content": "A step-by-step guide to implementing a complex Git strategy suitable for large, geographically dispersed teams. We cover branching models like GitFlow and Trunk-Based Development, focusing on pull request policies, merge conflict resolution best practices, and the integration of automated CI/CD pipelines. This ensures codebase stability and maximizes concurrent development efforts."
    },
    {
        "id": 1003,
        "category": "Technology/Hardware",
        "fiction": false,
        "content": "We review the current state of superconducting and trapped-ion quantum processors, examining the challenges related to decoherence and error correction. This article analyzes the recent performance benchmarks from leading labs and evaluates whether the technology has moved beyond purely academic interest into solving real-world, commercial problems. Includes projections for the next five years."
    },
    {
        "id": 1004,
        "category": "Technology/Security",
        "fiction": false,
        "content": "An essential guide for DApp developers and auditors, detailing the most critical security flaws found in production smart contracts. Topics covered include reentrancy attacks, integer overflow/underflow exploits, denial-of-service vectors, and front-running vulnerabilities. We provide code examples and mitigation techniques using Solidity and best practices for secure development."
    }
];

export default async function({params}: StoryProps){

    const id = use(params);

    try{
        const storyDataPromise= await axios.get<StoriesDetailsProps>('api/story/' + id);
        const storyData: StoriesDetailsProps = storyDataPromise.data;
        return (
        <div>
            <StoriesDetails {... storyData}></StoriesDetails>
        </div>

        )

    }catch(e){
        console.error("Error fetching story data:", e);
        return <div>Error loading story.</div>;
    }
    

    
}