//TODO: aktive spillere liste som dropdown ligesom i navbar på sm screens og tilføj tooltip til online spiller dot og lav nuværende spiller font-semibold eller order efter tur og lav modal boks til når man klikker på en spiller senere hvor man kan se deres stats
//TODO: vis current spillers yatzy stats og indtil det er din tur er dine yatzy stats små i et hjørne eller lign med titel over
//TODO: hvis også offline spillere evt eller gør de kan leave eller så kun online kan spille
//TODO: evt lav en yatsy bræt med nuværende spiller og dig undtagen hvis det er dig så kun dig eller forrige og næste spiller også
//TODO: næste tur knap
//TODO: modal hvor man enten kan tilmelde sig spillet eller klikke på en af de røde navne (betyder det ikke er optaget) blå er optaget og spiller lige nu
//TODO: fyrværkeri hvis jatsy eller spil er slut
//TODO: estimeret tid og når det er din tur så en lydeffekt
"use client"

import {useEffect, useState} from "react";
import YatzySheet from "@/components/YatzySheet";
import Players from "@/components/Players";
import Dice from "@/components/Dice";
import LoginPortal from "@/components/LoginPortal";

type YatsyProps = {
    instanceId: string
}

export default function Yatsy({ instanceId }: YatsyProps) {
    const [currentPlayers, setCurrentPlayers] = useState<string[]>(["Alice", "Poul", "Peter", "Bob"])
    const [dice1, setDice1] = useState<boolean>(false)
    const [dice2, setDice2] = useState<boolean>(false)
    const [dice3, setDice3] = useState<boolean>(false)
    const [dice4, setDice4] = useState<boolean>(false)
    const [dice5, setDice5] = useState<boolean>(false)
    const [dice1Number, setDice1Number] = useState<number>(6)
    const [dice2Number, setDice2Number] = useState<number>(6)
    const [dice3Number, setDice3Number] = useState<number>(6)
    const [dice4Number, setDice4Number] = useState<number>(6)
    const [dice5Number, setDice5Number] = useState<number>(6)
    const [opdatering, setOpdatering] = useState<number>(0)
    const apiBase = process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:5328' : 'https://jatzy.vercel.app'
    const [totalDice, setTotalDice] = useState<number>(0)
    const [user, setUser] = useState<string>("")
    const [loggedIn, setLoggedIn] = useState<boolean>(false)
    const [password, setPassword] = useState<string>("")
    useEffect(() => {
        fetch(`${apiBase}/api/data/${instanceId}`)
            .then((response) => response.json())
            .then((data) => {
                setCurrentPlayers(data.players)
            })
    }, [opdatering])
    if (loggedIn) {
        fetch(`${apiBase}/api/data/${instanceId}/${user}/${password}`)
            .then((response) => response.json())
            .then((data) => {
                setCurrentPlayers(data.players)
            })
    }
    useEffect(() => {
        setTotalDice((dice1 ? 1 : 0) + (dice2 ? 1 : 0) + (dice3 ? 1 : 0) + (dice4 ? 1 : 0) + (dice5 ? 1 : 0));
    }, [dice1, dice2, dice3, dice4, dice5]);

    return (
        <>
        <main className="min-h-screen w-full flex flex-col p-12">
            <div className="grid grid-cols-[1fr_4fr]">
                <div className="grid grid-rows-[3fr_4fr] justify-center">
                    <Players currentPlayers={currentPlayers}/>
                    <div className="grid grid-cols-2 gap-x-2 p-4 pl-0">
                        <Dice realDiceNumber={dice1Number} selected={dice1} setSelected={setDice1}/>
                        <Dice realDiceNumber={dice2Number} selected={dice2} setSelected={setDice2}/>
                        <Dice realDiceNumber={dice3Number} selected={dice3} setSelected={setDice3}/>
                        <Dice realDiceNumber={dice4Number} selected={dice4} setSelected={setDice4}/>
                        <Dice realDiceNumber={dice5Number} selected={dice5} setSelected={setDice5}/>
                    </div>
                    <div className="flex justify-center items-center h-12 w-46">
                        {totalDice > 1 ? (
                            <button className="p-2 px-4 border-2 border-blue-500 rounded-2xl text-xl text-black/80
            font-semibold shadow-sm hover:shadow-md hover:bg-blue-500 hover:text-blue-50">Rul {totalDice} terninger</button>
                        ): totalDice > 0 && (
                            <button className="p-2 px-4 border-2 border-blue-500 rounded-2xl text-xl text-black/80
            font-semibold shadow-sm hover:shadow-md hover:bg-blue-500 hover:text-blue-50">Rul {totalDice} terning</button>
                        )}
                    </div>
                </div>
                <div className="mt-4">
                <YatzySheet
                    size={1}
                    currentPlayers={["Dig (Poul)","Nuværende (Alice)", "Bedste (Bob)", "Værste (Peter)",]}
                    scores={{
                        ettere: { 0: 3 },
                        bonus: { 1: 50 }
                    }}
                    previews={{
                        toere: { 0: "8" },
                        yatzy: { 1: "50" }
                    }}
                    onCellClick={(category, playerIndex) => {
                        console.log(`Clicked ${category} for player ${playerIndex}`);
                    }}
                />
                </div>
            </div>
        </main>
            {!loggedIn && (
                <LoginPortal players={currentPlayers} setLogin={setLoggedIn} apiBase={apiBase} instanceId={instanceId} />
            )}
        </>
)
}