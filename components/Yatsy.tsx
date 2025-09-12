//TODO: aktive spillere liste som dropdown ligesom i navbar på sm screens og tilføj tooltip til online spiller dot og lav nuværende spiller font-semibold eller order efter tur og lav modal boks til når man klikker på en spiller senere hvor man kan se deres stats
//TODO: vis current spillers yatzy stats og indtil det er din tur er dine yatzy stats små i et hjørne eller lign med titel over
//TODO: hvis også offline spillere evt eller gør de kan leave eller så kun online kan spille
//TODO: evt lav en yatsy bræt med nuværende spiller og dig undtagen hvis det er dig så kun dig eller forrige og næste spiller også
//TODO: næste tur knap
//TODO: modal hvor man enten kan tilmelde sig spillet eller klikke på en af de røde navne (betyder det ikke er optaget) blå er optaget og spiller lige nu
"use client"

import {useEffect, useState} from "react";

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
        <main className="min-h-screen w-full flex flex-col p-20">
            <div className="rounded-lg border-2 border-black/20 w-52 flex flex-col p-4 bg-white/40 h-80">
            <h2 className="font-semibold text-xl text-black/80 mb-4">Spillere</h2>
            <ul className="w-full overflow-y-auto">
                {currentPlayers.map((currentPlayer, i) => (
                    <li key={i} className="flex items-center justify-between w-full py-2 px-2 rounded-md text-lg font-medium text-black/80 hover:bg-blue-200/40 border-2 border-transparent hover:border-2 hover:border-blue-500/40 transition-colors cursor-pointer">{currentPlayer}<div className="w-3 h-3 rounded-full bg-blue-500"/></li>
                ))}
            </ul>
            </div>
        </main>
    )
}