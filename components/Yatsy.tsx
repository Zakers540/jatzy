"use client"

import {useEffect, useState} from "react";

type YatsyProps = {
    instanceId: string
}

export default function Yatsy({ instanceId }: YatsyProps) {
    const [players, setPlayers] = useState<string[]>([])
    const apiBase = process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:5328' : 'https://jatzy.vercel.app'
    useEffect(() => {
        fetch(`${apiBase}/api/data/${instanceId}`)
            .then((response) => response.json())
            .then((data) => {
                setPlayers(data.players)
            })
    }, [])
    return (
        <main className="min-h-screen w-full flex justify-center items-center">
            <ul>
                {players.map((player, i) => (
                    <li key={i}>{player}</li>
                ))}
            </ul>
        </main>
    )
}