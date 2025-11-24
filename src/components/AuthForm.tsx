import Link from "next/link"

export default function AuthForm({isSignIn}: {isSignIn: boolean}) {
    
    
    return (
        <div className="space-y-4 flex flex-col items-center ml-auto mr-auto bg-zinc-300 w-fit p-5 m-5 rounded-md">
            <div className="space-y-5">
                {
                    !isSignIn && 
                        (
                        <div>
                            <p>Username</p>
                            <input type="text" className="border-black border-2 p-2 rounded-md" />
                        </div>
                        )
                }
                <div>
                    <p>Email</p>
                    <input type="email" className="border-black border-2 p-2 rounded-md"/>
                </div>
                <div>
                    <p>Password</p>
                    <input type="password" className="border-black border-2 p-2 rounded-md"/>
                </div>
            </div>

            <button className="border-black border-2 p-2 bg-red-800 rounded-lg text-white">Sign {isSignIn ? "In" : "Up"}</button>
            <Link href={isSignIn ? "/signup" : "/signin"}>
                <p className = "text-blue-500">{isSignIn ? "Create an account" : "Already have an account?"}</p>
            </Link>
        </div>
    )
}