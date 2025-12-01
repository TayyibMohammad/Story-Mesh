import socialsCardProps from "~/components/socialsCardProps";
import SocialsCard from "~/components/socialsCard";


export default function Footer() {
    
    
    const linkedin: socialsCardProps = {
        svgSrc: "/linkedin.svg",
        link: "https://www.linkedin.com/",
        name: "LinkedIn"
      }
    
      const github: socialsCardProps = {
        svgSrc: "/github.svg",
        link: "https://github.com/",
        name: "GitHub"
      }
    
      const leetcode: socialsCardProps = {
        svgSrc: "/leetcode.png",
        link: "https://leetcode.com/",
        name: "LeetCode"
      }
    
      const x: socialsCardProps = {
        svgSrc: "/x.svg",
        link: "https://twitter.com/",
        name: "Twitter"
      }
    return (
        <footer className="bg-black p-10">
        
                <div className="flex items-center">
                  <p className="text-white">About the author: </p>
                  <SocialsCard {... linkedin}/>
                  <SocialsCard {... github}/>
                  <SocialsCard {... leetcode}/>
                  <SocialsCard {... x}/>
                </div>
        </footer>
    )
}