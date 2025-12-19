"use client";

import React, { useState, useMemo, use } from "react";
import { marked } from 'marked';
import DOMPurify from 'dompurify';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function WriteIdStory({ params }: PageProps) {
  // Use the 'use' hook to unwrap the Promise
  const { id } = use(params);
  
  const [markdown, setMarkdown] = useState<string>(
    `# Story ID: ${id}\n\n## Start Your Story Here\n\nThis is **bold** text and this is *italic* text.\n\n- Use lists\n- To organize ideas\n\n\`\`\`javascript\nconst hello = "world";\n\`\`\`\n\n---`
  );



  const htmlPreview = useMemo(() => {
    const rawHtml = marked.parse(markdown, {
      gfm: true,
      breaks: true
    }) as string;

    const sanitizedHtml = DOMPurify.sanitize(rawHtml);
    return sanitizedHtml;
  }, [markdown]);

  const handleSubmit = async () => {
    try {
      const response = await fetch(`/api/story/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ markdown }),
      });

      if (response.ok) {
        console.log("Story updated successfully!");
      } else {
        console.error("Failed to update story.");
      }
    } catch (error) {
      console.error("Error updating story:", error);
    }
  };

  return (
    <div className="flex gap-4 p-8">
      <div className="flex-1">
        <h1 className="text-2xl font-bold mb-4">Write your story</h1>
        <textarea
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
          placeholder="Write your story using markdown"
          className="w-full h-96 p-4 border rounded-lg font-mono"
        />
        <p className="mt-2 text-sm text-gray-600">
          Word Count: {markdown.split(/\s+/).filter(Boolean).length}
        </p>
      </div>

      <div className="flex-1 flex flex-col justify-between">
        <div>
            <h1 className="text-2xl font-bold mb-4">Preview</h1>
            <div 
            className="prose max-w-none p-4 border rounded-lg bg-white"
            dangerouslySetInnerHTML={{ __html: htmlPreview }} 
            />
        </div>
        <button 
        onClick={handleSubmit}
        className="border-black border-2 p-2 bg-red-800 rounded-lg text-white">Save</button>
      </div>
    </div>
  );
}