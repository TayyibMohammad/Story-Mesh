import ExplainCardsProps from "./explainCardsProps";

export default function ExplainCards( { svgSrc, text }: ExplainCardsProps ) {
    return (
        <div className="flex flex-col items-center justify-center w-fit bg-slate-500 rounded-3xl p-5 h-[30vh]">
            <img src={svgSrc} alt="" className="h-12 m-5"/>
            <p className="text-xl mt-3 text-white p-5">
                {text}
            </p>
        </div>
    );
}
