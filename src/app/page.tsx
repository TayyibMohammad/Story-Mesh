import ExplainCards from "~/components/explainCards";
import ExplainCardsProps  from "~/components/explainCardsProps";

export default function Home() {

  const props1: ExplainCardsProps = {
    svgSrc: "/write.svg",
    text: "Write a story"
  }

  const props2: ExplainCardsProps = {
    svgSrc: "/contribution.png",
    text: "Lets others contribute"
  }

  const props3: ExplainCardsProps = {
    svgSrc: "/famous.svg",
    text: "If lucky become successfull"
  }


  return (
    <div className="">
      <div className="flex shadow-md items-center justify-between h-[50vh]">
        <img src="/pen.svg" alt="" className="h-[50vh] m-5"/>

        <button className="bg-amber-400 p-2 border-black border-2">Write a story!</button>
       
        <article className="w-[30vw] font-serif inline-block">
      
      {/* Use a flex container for the first line to align the text and logo */}
      <div className="flex items-center text-lg mb-4">
        <span>At</span>
        <img src="/Logo.svg" alt="Story Mesh Logo" className="h-5 mx-2" />
        <span>we believe the best stories are shared.</span>
      </div>
      
      <p className="text-gray-700">
        Kick off your own narrative, or browse our growing library of tales waiting for their next chapter. Our platform connects
        writers from across the globe, allowing you to seamlessly contribute to collaborative 
        works and watch your favorite stories evolve in real-time. 
        Your voice is the missing piece.
      </p>
    </article>
      </div>
      <div className="flex flex-col items-center justify-center pb-5">
        <p className="text-3xl mt-3 mb-5 ">
          How it works
        </p>

        <div className="flex items-center justify-center space-x-8">
          <ExplainCards {... props1}/>
          <ExplainCards {... props2}/>
          <ExplainCards {... props3}/>
        </div>
      </div>

      
      </div>
  );
}
