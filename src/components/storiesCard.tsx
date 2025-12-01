import StoriesCardProps from "./storiesCardProps";
import Link from 'next/link'


export default function storiesCard(stories : {stories: StoriesCardProps}) {


    return (
        <div key={stories.stories.id} className="min-w-fit border-black border-2 rounded-md p-3 m-5 hover:cursor-pointer">
            <Link href={`/stories/${stories.stories.id}`}>
                <div className="flex justify-between border-black-200 border-2 rounded-md p-3 m-4 hover:bg-zinc-300">
                    <p className="font-extralight">{stories.stories.title}</p>
                    <p className="font-bold">#{stories.stories.id}</p>
                </div>
            </Link>

            <div className="flex space-x-3">
                <div className="flex">
                    <span>likes:</span>
                    <p>{stories.stories.likes}</p>
                </div>

                <div className="flex">
                    <span>comments:</span>
                    <p>{stories.stories.numberOfComments}</p>
                </div>

                <div className="flex">
                    <span>contributors:</span>
                    <p>{stories.stories.numberOfContributors}</p>
                </div>

                <div className="flex">
                    <span>views:</span>
                    <p>{stories.stories.views}</p>
                </div>
            </div>
        </div>
    )
}