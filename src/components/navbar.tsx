import Link from "next/link";
export default function Navbar() {
    return (
        <nav className="h-16 shadow-md flex items-center justify-between bg-fuchsia-50">
            <img src="/Logo.svg" alt="Logo" className="h-16"/>
            <div className="">
                <input type="text" placeholder="Search stories" className="h-10 border-black border-2 p-2"/>
                <Link href='/signin'>
                    <button className="mr-10 ml-10 bg-orange-600 p-2">Sign In</button>
              </Link>
            </div>
        </nav>
    );
}

// ../public/StoryMeshLogo.svg