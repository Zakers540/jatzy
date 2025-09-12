//TODO: aktive spillere liste som dropdown ligesom i navbar på sm screens og tilføj tooltip til online spiller dot og lav nuværende spiller font-semibold eller order efter tur og lav modal boks til når man klikker på en spiller senere hvor man kan se deres stats
//TODO: vis current spillers yatzy stats og indtil det er din tur er dine yatzy stats små i et hjørne eller lign med titel over
//TODO: hvis også offline spillere evt eller gør de kan leave eller så kun online kan spille
//TODO: evt lav en yatsy bræt med nuværende spiller og dig undtagen hvis det er dig så kun dig eller forrige og næste spiller også
//TODO: næste tur knap
//TODO: modal hvor man enten kan tilmelde sig spillet eller klikke på en af de røde navne (betyder det ikke er optaget) blå er optaget og spiller lige nu
//TODO: fyrværkeri hvis jatsy eller spil er slut
"use client"

import {useEffect, useState} from "react";
import YatzySheet from "@/components/YatzySheet";
import Players from "@/components/Players";

type YatsyProps = {
    instanceId: string
}

export default function Yatsy({ instanceId }: YatsyProps) {
    const [currentPlayers, setCurrentPlayers] = useState<string[]>([])
    const apiBase = process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:5328' : 'https://jatzy.vercel.app'
    useEffect(() => {
        fetch(`${apiBase}/api/data/${instanceId}`)
            .then((response) => response.json())
            .then((data) => {
                setCurrentPlayers(data.players)
            })
    }, [])
    return (
        <main className="min-h-screen w-full flex flex-col p-16 py-20">
            <Players currentPlayers={currentPlayers}/>
            <YatzySheet/>
        </main>
    )
}