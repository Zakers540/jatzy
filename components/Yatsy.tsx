//TODO: aktive spillere liste som dropdown ligesom i navbar på sm screens og tilføj tooltip til online spiller dot og lav nuværende spiller font-semibold eller order efter tur og lav modal boks til når man klikker på en spiller senere hvor man kan se deres stats
//TODO: vis current spillers yatzy stats og indtil det er din tur er dine yatzy stats små i et hjørne eller lign med titel over
//TODO: hvis også offline spillere evt eller gør de kan leave eller så kun online kan spille
//TODO: næste tur knap
//TODO: modal hvor man enten kan tilmelde sig spillet eller klikke på en af de røde navne (betyder det ikke er optaget) blå er optaget og spiller lige nu
//TODO: fyrværkeri hvis jatsy eller spil er slut
//TODO: estimeret tid og når det er din tur så en lydeffekt
//TODO: lyt på et url f.eks. /api/opdatering og opdater når den siger du skal
//TODO: tilføj reload til logud
"use client"

import {useEffect, useState} from "react";
import YatzySheet from "@/components/YatzySheet";
import Players from "@/components/Players";
import Dice from "@/components/Dice";
import LoginPortal from "@/components/LoginPortal";
import ClickedPlayer from "@/components/ClickedPlayer";
import { createClient } from '@supabase/supabase-js'

type YatsyProps = {
    instanceId: string
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
    | "treens"
    | "fireens"
    | "lillestraight"
    | "storstraight"
    | "fuldthus"
    | "chance"
    | "yatzy"
    | "total";

let DATABASE_URL: string
let DATABASE_KEY: string

if (process.env.DATABASE_URL && process.env.DATABASE_KEY) {
    DATABASE_URL = process.env.DATABASE_URL
    DATABASE_KEY = process.env.DATABASE_KEY
}

const supabase = createClient(DATABASE_URL, DATABASE_KEY)

let currentPlayers = []
let bestPlayer = null
let worstPlayer = null
let dice1Number = 6
let dice2Number = 6
let dice3Number = 6
let dice4Number = 6
let dice5Number = 6
let yatzyResults: Partial<Record<YatzyCategory, Record<number, string | number>>> = {}

async function updateInstanceStats(instanceId: string) {
    const {data: playerData, error} = await supabase
        .from("user")
        .select("*")
        .eq("gameInstance", instanceId)
        .order("turn", {ascending: true})
    const {data: serverData} = await supabase
        .from("server")
        .select("dice1, dice2, dice3, dice4, dice5")
        .eq("gameInstance", instanceId)
        .single()

    if (error) {
        console.error(error)
        return
    }
    players = playerData

    if (playerData.length > 0) {
        bestPlayer = [...playerData].sort((a, b) => b.score - a.score)
        worstPlayer = [...playerData].sort((a, b) => a.score - b.score)
    }

    if (serverData.dice1) {
        dice1Number = serverData.dice1
    }
    if (serverData.dice2) {
        dice2Number = serverData.dice2
    }
    if (serverData.dice3) {
        dice3Number = serverData.dice3
    }
    if (serverData.dice4) {
        dice4Number = serverData.dice4
    }
    if (serverData.dice5) {
        dice5Number = serverData.dice5
    }
    if (serverData.yatzysheet) {
        yatzyResults = serverData.yatzysheet
    }
}

function listenForChanges(instanceId: string) {
    supabase
        .channel("opdatering")
        .on(
            "postgres_changes",
            {event: "*", schema: "public", table: "user"},
            ()=> updateInstanceStats(instanceId)
        )
        .subscribe()
}

function YatzyPreview(dice1Number:number, dice2Number:number, dice3Number:number, dice4Number:number, dice5Number:number) {
    const playerIndex = 1
    const allDice: number[] = [dice1Number, dice2Number, dice3Number, dice4Number, dice5Number]
    const numberOfNumbers: number[] = [0, 0, 0, 0,0, 0]
    let hasThree = false
    let hasThreeVariable = 6
    let hasFour = false
    let hasFourVariable = 6
    let hasTwo = false
    let hasTwoVariable = 6
    let chance = 0;
    let hasYatzy = false;
    let hasYatzyVariable = 6;

    for (let i=0; i<5; i++) {
        const value = allDice[i]
        numberOfNumbers[value-1] = numberOfNumbers[value-1] + 1;
    }
    for (let i=0; i<5; i++) {
        chance = chance + allDice[i]
    }

    const result: Partial<Record<YatzyCategory, Record<number, string | number>>> = {};

    if (numberOfNumbers[0] > 0) {
        result.ettere = {[playerIndex]: (numberOfNumbers[0]).toString()}
    }
    if (numberOfNumbers[1] > 0) {
        result.toere = {[playerIndex]: (numberOfNumbers[1] * 2).toString()}
    }
    if (numberOfNumbers[2] > 0) {
        result.treere = {[playerIndex]: (numberOfNumbers[2] * 3).toString()}
    }
    if (numberOfNumbers[3] > 0) {
        result.firere = {[playerIndex]: (numberOfNumbers[3] * 4).toString()}
    }
    if (numberOfNumbers[4] > 0) {
        result.femmere = {[playerIndex]: (numberOfNumbers[4] * 5).toString()}
    }
    if (numberOfNumbers[5] > 0) {
        result.seksere = {[playerIndex]: (numberOfNumbers[5] * 6).toString()}
    }

    while (!hasThree && hasThreeVariable > 0) {
        if (numberOfNumbers[hasThreeVariable-1] > 2) {
            result.treens = {[playerIndex]: hasThreeVariable*3}
            hasThree = true
        } else {
            hasThreeVariable = hasThreeVariable - 1;
        }
    }
    while (!hasFour && hasFourVariable > 0) {
        if (numberOfNumbers[hasFourVariable-1] > 3) {
            result.fireens = {[playerIndex]: hasFourVariable*4}
            hasFour = true
        } else {
            hasFourVariable = hasFourVariable - 1;
        }
    }

    if (numberOfNumbers[0] && numberOfNumbers[1] && numberOfNumbers[2] && numberOfNumbers[3] && numberOfNumbers[4]) {
        result.lillestraight = {[playerIndex]: "15"}
    }
    if (numberOfNumbers[1] && numberOfNumbers[2] && numberOfNumbers[3] && numberOfNumbers[4] && numberOfNumbers[5]) {
        result.storstraight = {[playerIndex]: "20"}
    }

    while (!hasTwo && hasTwoVariable > 0) {
        if (numberOfNumbers[hasTwoVariable-1] > 1 && hasThreeVariable !== hasTwoVariable) {
            hasTwo = true
        } else {
            hasTwoVariable = hasTwoVariable - 1;
        }
    }
    if (hasTwo && hasThree && hasTwoVariable > 0 && hasThreeVariable > 0) {
        result.fuldthus = {[playerIndex]: hasTwoVariable*2+hasThreeVariable*3}
    }

    if (chance > 0) {
        result.chance = {[playerIndex]: chance.toString()}
    }

    while (!hasYatzy && hasYatzyVariable > 0) {
        if (numberOfNumbers[hasYatzyVariable-1] > 4) {
            result.yatzy = {[playerIndex]: hasYatzyVariable*6+50}
            hasYatzy = true
        } else {
            hasYatzyVariable = hasYatzyVariable - 1;
        }
    }

    return result
}

export default function Yatsy({ instanceId }: YatsyProps) {
    // laver variabler, som ville blive opdateret ift backend ved mindre det udelukkende er for udseende eller bare til frontend
    const [dice1, setDice1] = useState<boolean>(false)
    const [dice2, setDice2] = useState<boolean>(false)
    const [dice3, setDice3] = useState<boolean>(false)
    const [dice4, setDice4] = useState<boolean>(false)
    const [dice5, setDice5] = useState<boolean>(false)
    const [rul, setRul] = useState<boolean>(false)
    //URL til hjemmeside skal være absolut dev server har andet url end prod.
    const apiBase = process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:5328' : 'https://jatzy.vercel.app'
    const [totalDice, setTotalDice] = useState<number>(0)
    const [user, setUser] = useState<string>("")
    const [loggedIn, setLoggedIn] = useState<boolean>(false)
    const [password, setPassword] = useState<string>("")
    const [clickedPlayer, setClickedPlayer] = useState<boolean>(false)
    const [clickedPlayerName, setClickedPlayerName] = useState<string>("")

    //får variablerne fra backend hver gang const opdatering bliver opdateret
    useEffect(() => {
        listenForChanges(instanceId)
        updateInstanceStats(instanceId)
        const makeAPICall = () => {
            if (navigator.sendBeacon) {
                navigator.sendBeacon(`${apiBase}/api/logud/`);
            } else {
                fetch(`${apiBase}/api/logud/`, {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({
                        instanceId: instanceId,
                        user: user,
                        password: password,
                    }),
                    keepalive: true
                });
            }
        };

        const handleBeforeUnload = () => makeAPICall();

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [apiBase]);

    //hver gang en af terningerne opdateres finder den total antal terninger
    useEffect(() => {
        setTotalDice((dice1 ? 1 : 0) + (dice2 ? 1 : 0) + (dice3 ? 1 : 0) + (dice4 ? 1 : 0) + (dice5 ? 1 : 0));
    }, [dice1, dice2, dice3, dice4, dice5]);
    //finder terningers værdier fra backend hver gang der bliver rullet
    useEffect(()=> {
        if (dice1) {
            fetch(`${apiBase}/api/rul/${instanceId}/${user}/${password}/terning1`)
                .then((response) => response.json())
                .then((data) => {
                    setDice1Number(data.dice)
                })
        }
        if (dice2) {
            fetch(`${apiBase}/api/rul/${instanceId}/${user}/${password}/terning2`)
                .then((response) => response.json())
                .then((data) => {
                    setDice2Number(data.dice)
                })
        }
        if (dice3) {
            fetch(`${apiBase}/api/rul/${instanceId}/${user}/${password}/terning3`)
                .then((response) => response.json())
                .then((data) => {
                    setDice3Number(data.dice)
                })
        }
        if (dice4) {
            fetch(`${apiBase}/api/rul/${instanceId}/${user}/${password}/terning4`)
                .then((response) => response.json())
                .then((data) => {
                    setDice4Number(data.dice)
                })
        }
        if (dice5) {
            fetch(`${apiBase}/api/rul/${instanceId}/${user}/${password}/terning5`)
                .then((response) => response.json())
                .then((data) => {
                    setDice5Number(data.dice)
                })
        }
    }, [rul])

    return (
        <>
        <main className="min-h-screen lg:h-screen w-full flex flex-col p-12">
            <div className="grid grid-cols-[1fr_4fr]">
                <div className="grid grid-rows-[3fr_4fr] justify-center">
                    <Players currentPlayers={currentPlayers} setClickedPlayer={setClickedPlayer} setClickedPlayerName={setClickedPlayerName} />
                    <div className="grid grid-cols-2 gap-x-2 p-4 pl-0">
                        <Dice realDiceNumber={dice1Number} selected={dice1} setSelected={setDice1} currentPlayers={currentPlayers} user={user}/>
                        <Dice realDiceNumber={dice2Number} selected={dice2} setSelected={setDice2} currentPlayers={currentPlayers} user={user}/>
                        <Dice realDiceNumber={dice3Number} selected={dice3} setSelected={setDice3} currentPlayers={currentPlayers} user={user}/>
                        <Dice realDiceNumber={dice4Number} selected={dice4} setSelected={setDice4} currentPlayers={currentPlayers} user={user}/>
                        <Dice realDiceNumber={dice5Number} selected={dice5} setSelected={setDice5} currentPlayers={currentPlayers} user={user}/>
                    </div>
                    <div className="flex justify-center items-center h-12 w-46">
                        {totalDice > 1 && user===currentPlayers[0] ? (
                            <button className="p-2 px-4 border-2 border-blue-500 rounded-2xl text-xl text-black/80
            font-semibold shadow-sm hover:shadow-md hover:bg-blue-500 hover:text-blue-50" onClick={()=> {setRul(!rul)}}>Rul {totalDice} terninger</button>
                        ): totalDice > 0 && user===currentPlayers[0] && (
                            <button className="p-2 px-4 border-2 border-blue-500 rounded-2xl text-xl text-black/80
            font-semibold shadow-sm hover:shadow-md hover:bg-blue-500 hover:text-blue-50" onClick={()=> {setRul(!rul)}}>Rul {totalDice} terning</button>
                        )}
                    </div>
                </div>
                <div className="mt-4">
                <YatzySheet
                    size={1}
                    currentPlayers={[`Dig (${user || "Poul"})`,`Nuværende (${currentPlayers[0] || "Peter"})`, `Bedste (${bestPlayer || "Poul"})`, `Værste (${worstPlayer || "Pil"})`]}
                    scores={yatzyResults}
                    previews={
                        YatzyPreview(dice1Number, dice2Number, dice3Number, dice4Number, dice5Number)
                    }
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
            {clickedPlayer && clickedPlayer && (
                <ClickedPlayer instanceId={instanceId} apiBase={apiBase} clickedPlayerName={clickedPlayerName} setClickedPlayer={setClickedPlayer} />
            )}
        </>
)
}