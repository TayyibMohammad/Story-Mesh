import StoriesDetailsProps from "./storiesDetailProp";


export default function StoriesDetails({id , fiction, content, category} : StoriesDetailsProps){
    return (
        <div className="border-black border-2 rounded-md p-3 m-5">
            <div  className="border-black border-2 rounded-md p-3 m-5">
                <p>{content}</p>
            </div>

            <div className="flex space-x-3 ">
                <p className="bg-orange-400 rounded-sm p-1 ml-auto">{category}</p>
                <p className="bg-green-600 rounded-sm p-1">{fiction ? "Fiction" : "Non Fiction"}</p>
            </div>


        </div>
    )
}