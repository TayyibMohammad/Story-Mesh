import socialsCardProps from "./socialsCardProps";
export default function SocialsCard({svgSrc, link, name} : socialsCardProps) {
    return (
        <div className="mr-5 ml-3 bg-white rounded-full p-2">
            <a href={link} >
                <img src={svgSrc} alt={name} className="h-5" />
            </a>
        </div>
    );
}