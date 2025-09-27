import {Dispatch, SetStateAction, useState} from "react";
import YatzySheet from "@/components/YatzySheet";

type ClickedPlayerProps = {
    clickedPlayerName: string;
    setClickedPlayer: Dispatch<SetStateAction<boolean>>;
}

type YatzyCategory =
    | "ettere"
    | "toere"
    | "treere"
    | "firere"
    | "femmere"
    | "seksere"
    | "sum"
    | "bonus"
    | "1par"
    | "2par"
    | "3ens"
    | "4ens"
    | "lillestraight"
    | "storstraight"
    | "fuldthus"
    | "chance"
    | "yatzy"
    | "total";

export default function ClickedPlayer({clickedPlayerName, setClickedPlayer}: ClickedPlayerProps) {
    const [playerNameScores, setPlayerNameScores] = useState<Record<YatzyCategory, Record<number, number>>>();
    return (
        <div className="fixed inset-0 flex flex-col z-50 items-center justify-center backdrop-blur-sm bg-black/5">
            <div className="relative bg-white/64 max-w-lg w-full rounded-md max-h-180 border-1 border-white/80">
                <div className="absolute right-0 p-2">
                    <svg className="flex justify-end text-black/85 hover:text-black hover:scale-105 transition" onClick={(()=>{setClickedPlayer(false)})} xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="currentColor"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
                </div>
                <div className=" pt-4 flex justify-center -mb-12">
                    <h2 className="text-center text-xl font-medium mb-6 cursor-default">test</h2>
                </div>
                <YatzySheet size={0.8} currentPlayers={[clickedPlayerName]} scores={playerNameScores}/>
            </div>
        </div>
    )
}