
export default function Write() {
    return (
        <div className="flex flex-col items-center">
            {/* basic questions */}
            <div className="flex flex-col space-y-5 bg-slate-200 w-fit ml-auto mr-auto p-5 m-5  rounded-md">

                <div className="flex items-center">
                    <span>Title: </span>
                    <input type="text" className="border-black border-2 p-2 rounded-md"/>
                </div>

                <div className="flex items-center">
                    <span>Genre: </span>
                    {/* comedy
                        fan-fiction
                        thriller
                        romantic
                        action
                        NSFW(only 18+ can view) */}
                    <select className="border-black border-2 p-2 rounded-md">
                        <option value="">-- Select a option --</option>
                        <option value="fan-fiction">fan-fiction</option>
                        <option value="thriller">thriller</option>
                        <option value="romantic">romantic</option>
                        <option value="action">action</option>
                        <option value="NSFW">NSFW(only 18+ can view)</option>
                    </select>
                </div>

                <div className="flex items-center space-x-2">
                    <span>Fiction</span>
                    <input type="checkbox" /> 
                </div>
                <div className="flex items-center space-x-2">
                    <span>Other can contribute?</span>
                    <input type="checkbox" /> 
                </div>
            </div>

            <button className="border-black border-2 p-2 bg-red-800 rounded-lg text-white">Start writing</button>

        </div>
    )
}