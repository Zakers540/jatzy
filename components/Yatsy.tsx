//TODO: hvis også offline spillere evt eller gør de kan leave eller så kun online kan spille
//TODO: modal hvor man enten kan tilmelde sig spillet eller klikke på en af de røde navne (betyder det ikke er optaget) blå er optaget og spiller lige nu
//TODO: fyrværkeri hvis jatsy eller spil er slut
//TODO: estimeret tid og når det er din tur så en lydeffekt
//TODO: tilføj reload til logud
"use client"

import {useEffect, useState} from "react";
import YatzySheet from "@/components/YatzySheet";
import Players from "@/components/Players";
import Dice from "@/components/Dice";
import LoginPortal from "@/components/LoginPortal";
import ClickedPlayer from "@/components/ClickedPlayer";
import { createClient } from '@supabase/supabase-js'
import equal from 'fast-deep-equal';
import { useRef } from "react";
import { clearPreviewData } from "next/dist/server/api-utils";
import confetti from "canvas-confetti"

type YatsyProps = {
    instanceId: string
    playerName: string
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
    | "treens"
    | "fireens"
    | "lillestraight"
    | "storstraight"
    | "fuldthus"
    | "chance"
    | "yatzy"
    | "total";

// Use NEXT_PUBLIC environment variables on the client
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://whaiekidzkrnqiyykhjr.supabase.co'
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndoYWlla2lkemtybnFpeXlraGpyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzY2MTQ1NCwiZXhwIjoyMDczMjM3NDU0fQ.A1_HE8IYw-K1jyr0rygcsPMN7Nyv0WfvZqRvbTfj9vU'
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.warn('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY - realtime will not work')
}
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

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

const confettiTrigger = () => {
    const duration = 5 * 1000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

    const randomInRange = (min: number, max: number) =>
        Math.random() * (max - min) + min

    const interval = window.setInterval(() => {
        const timeLeft = animationEnd - Date.now()

        if (timeLeft <= 0) {
            return clearInterval(interval)
        }

        const particleCount = 50 * (timeLeft / duration)
        confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        })
        confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        })
    }, 250)
}

export default function Yatsy({ instanceId, playerName }: YatsyProps) {
    // laver variabler, som ville blive opdateret ift backend ved mindre det udelukkende er for udseende eller bare til frontend
    const [dice1, setDice1] = useState<boolean>(false)
    const [dice2, setDice2] = useState<boolean>(false)
    const [dice3, setDice3] = useState<boolean>(false)
    const [dice4, setDice4] = useState<boolean>(false)
    const [dice5, setDice5] = useState<boolean>(false)
    const [rul, setRul] = useState<boolean>(true)
    const [rulCounter, setRulCounter] = useState<number>(0)
    //URL til hjemmeside skal være absolut dev server har andet url end prod.
    const apiBase = process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:5328' : 'https://jatzy.vercel.app'
    const [totalDice, setTotalDice] = useState<number>(0)
    const [user, setUser] = useState<string>("")
    const [loggedIn, setLoggedIn] = useState<boolean>(false)
    const [password, setPassword] = useState<string>("")
    const [clickedPlayer, setClickedPlayer] = useState<boolean>(false)
    const [clickedPlayerName, setClickedPlayerName] = useState<string>("")

    // app state (moved from module-level mutable variables)
    const [playersState, setPlayersState] = useState<string[]>([""])
    const [bestPlayerState, setBestPlayerState] = useState<string>("")
    const [worstPlayerState, setWorstPlayerState] = useState<string>("")
    const [diceNumbersState, setDiceNumbersState] = useState<number[]>([6,6,6,6,6])
    const [yatzysheetState, setYatzysheetState] = useState<any>({scores:{}, previews:{}})
    const [currentTurnIndex, setCurrentTurnIndex] = useState<number>(0)
    const [currentTurnUser, setCurrentTurnUser] = useState<string>("")

    const mountedRef = useRef(true);
    const currentPlayer = playersState[currentTurnIndex]
    const myTurn = user === currentPlayer

    useEffect(()=>{
    document.addEventListener('keydown', function(event) {
        if (event.key === 'R' && (dice1 || dice2 || dice3 || dice4 || dice5) && rulCounter>3) {
            setRul(true)
        }
    })})

    // fetch initial data and subscribe to Supabase realtime updates for this instance
    useEffect(() => {
        mountedRef.current = true;

        const fetchInitial = async () => {
            try {
                const { data: users } = await supabase
                    .from('users')
                    .select('*')
                    .eq('gameInstance', instanceId)
                    .order('turn', { ascending: true })

                const { data: serverData } = await supabase
                    .from('server')
                    .select('dice,yatzysheet,currentTurn,instanceId')
                    .eq('instanceId', instanceId)
                    .single()

                if (!mountedRef.current) return
                setPlayersState((users || []).map((u: any) => u.username))
                if (users && users.length > 0) {
                    const sorted = [...users].sort((a: any, b: any) => (b.score || 0) - (a.score || 0))
                    setBestPlayerState(sorted[0]?.username || "")
                    setWorstPlayerState(sorted[sorted.length-1]?.username || "")
                }
                if (serverData?.dice) setDiceNumbersState(serverData.dice)
                if (serverData?.yatzysheet) setYatzysheetState(serverData.yatzysheet)
                if (serverData?.currentTurn !== undefined) setCurrentTurnIndex(serverData.currentTurn)
            } catch (e) {
                console.error('Failed to fetch initial instance data', e)
            }
        }

        fetchInitial()

        const serverChannel = supabase.channel(`server-instance-${instanceId}`)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'server', filter: `instanceId=eq.${instanceId}` }, (payload) => {
                console.debug('supabase server change payload', payload)
                const record = (payload as any).new || (payload as any).record || null
                
                if(!mountedRef.current || !record) return
                console.debug('server record update', record)
                if (record.dice) setDiceNumbersState(record.dice)
                if (record.yatzysheet) setYatzysheetState(record.yatzysheet)
                if (record.currentTurn !== undefined) setCurrentTurnIndex(record.currentTurn)
        
            })
            .subscribe()

        const usersChannel = supabase.channel(`users-instance-${instanceId}`)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'users', filter: `gameInstance=eq.${instanceId}` }, async (payload) => {
                console.debug('supabase users change payload', payload)
                if (!mountedRef.current) return;
                try {
                    const { data: users } = await supabase
                        .from('users')
                        .select('*')
                        .eq('gameInstance', instanceId)
                        .order('turn', { ascending: true })
                    setPlayersState((users || []).map((u: any) => u.username))
                } catch (e) {
                    console.error('Failed to refresh users on change', e)
                }
            })
            .subscribe()

        const makeAPICall = () => {
            if (navigator.sendBeacon) {
                navigator.sendBeacon(`${apiBase}/api/logud/`)
            } else {
                fetch(`${apiBase}/api/logud/`, {
                    method: 'POST', headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ instanceId: instanceId, user: user, password: password }), keepalive: true
                })
            }
        }

        const handleBeforeUnload = () => makeAPICall()
        window.addEventListener('beforeunload', handleBeforeUnload)

        return () => {
            mountedRef.current = false
            window.removeEventListener('beforeunload', handleBeforeUnload)
            try { serverChannel.unsubscribe() } catch (e) {}
            try { usersChannel.unsubscribe() } catch (e) {}
        }
    }, [instanceId, apiBase, user, password])

        useEffect(() => {
            if (!instanceId || !user) return;

            const channel = supabase
                .channel(`yatzy-${instanceId}`)
                .on(
                    'postgres_changes',
                    { event: '*', schema: 'public', table: 'users', filter: `gameInstance=eq.${instanceId}` },
                    async (payload) => {
                        try {
                            const res = await fetch(`${apiBase}/api/jatzySheet/${instanceId}/${encodeURIComponent(user)}`);
                            if (!res.ok) throw new Error("Failed to fetch updated sheet");
                            const data = await res.json();
                            if (!equal(data.yatzySheet, yatzysheetState)) {
                                setYatzysheetState(data.yatzySheet);
                            }
                            if (!equal(data.currentPlayer, playersState)) {
                                setPlayersState(data.currentPlayer);
                            }
                            if (!equal(data.bestPlayer, bestPlayerState)) {
                                setBestPlayerState(data.bestPlayer);
                            }
                            if (!equal(data.worstPlayer, worstPlayerState)) {
                                setWorstPlayerState(data.worstPlayer);
                            }
                            setRulCounter(0)
                        } catch (err) {
                            console.error("Failed to refresh Yatzy sheet:", err);
                        }
                    }
                )
                .subscribe();

            return () => {
                try { supabase.removeChannel(channel); } catch {}
            };
        }, [instanceId, apiBase, user]);

        const doLogout = async () => {
            try {
                await fetch(`${apiBase}/api/logud`, {
                    method: 'POST', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: user })
                })
            } catch (e) {
                console.error('logout failed', e)
            }
            try { localStorage.removeItem('jatzy_user'); localStorage.removeItem('jatzy_password') } catch (e) {}
            setUser(''); setPassword(''); setLoggedIn(false)
        }

    //hver gang en af terningerne opdateres finder den total antal terninger
    useEffect(() => {
    if (!rul) return;
    
    const fetchDie = async (which: number) => {
        try {
            const res = await fetch(`${apiBase}/api/rul/terning${which}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ instanceId, user })
            });

            if (!res.ok) {
                console.error(`Failed to fetch die ${which}:`, res.statusText);
                return null;
            }

            const data = await res.json();
            return data?.dice ?? null;
        } catch (e) {
            console.error(`fetch die ${which} error`, e);
            return null;
        }
    };

    (async () => {
        const results = await Promise.all([
            dice1 ? fetchDie(1) : null,
            dice2 ? fetchDie(2) : null,
            dice3 ? fetchDie(3) : null,
            dice4 ? fetchDie(4) : null,
            dice5 ? fetchDie(5) : null,
        ]);

        setDiceNumbersState((prev) => {
            const copy = [...prev];
            results.forEach((val, idx) => { 
                if (val !== null && val !== undefined) copy[idx] = val;
            });
            return copy;
        });

        setRul(false);
        setDice1(false);
        setDice2(false);
        setDice3(false);
        setDice4(false);
        setDice5(false);
    })();
}, [rul]);

    return (
        <>
        <main className="min-h-screen lg:h-screen w-full flex flex-col p-12">
            <div className="grid grid-cols-[1fr_4fr]">
                <div className="grid grid-rows-[3fr_4fr] justify-center">
                    <Players currentPlayers={playersState} setClickedPlayer={setClickedPlayer} setClickedPlayerName={setClickedPlayerName} />
                    <div className="grid grid-cols-2 gap-x-2 p-4 pl-0">
                        <Dice realDiceNumber={diceNumbersState[0]} selected={dice1} setSelected={setDice1} currentPlayers={playersState} user={user} myTurn={myTurn} setTotalDice={setTotalDice}/>
                        <Dice realDiceNumber={diceNumbersState[1]} selected={dice2} setSelected={setDice2} currentPlayers={playersState} user={user} myTurn={myTurn} setTotalDice={setTotalDice}/>
                        <Dice realDiceNumber={diceNumbersState[2]} selected={dice3} setSelected={setDice3} currentPlayers={playersState} user={user} myTurn={myTurn} setTotalDice={setTotalDice}/>
                        <Dice realDiceNumber={diceNumbersState[3]} selected={dice4} setSelected={setDice4} currentPlayers={playersState} user={user} myTurn={myTurn} setTotalDice={setTotalDice}/>
                        <Dice realDiceNumber={diceNumbersState[4]} selected={dice5} setSelected={setDice5} currentPlayers={playersState} user={user} myTurn={myTurn} setTotalDice={setTotalDice}/>
                    </div>
                    <div className="flex justify-center items-center h-12 w-46">
                        {myTurn && totalDice > 1 && rulCounter < 3 ? (
                            <button className="p-2 px-4 border-2 border-blue-500 rounded-2xl text-xl text-black/80
            font-semibold shadow-sm hover:shadow-md hover:bg-blue-500 hover:text-blue-50" onClick={()=> {setRul(!rul); setRulCounter(rulCounter + 1)}}>Rul {totalDice} terninger</button>
                        ): myTurn && totalDice > 0 && rulCounter < 3 && (
                            <button className="p-2 px-4 border-2 border-blue-500 rounded-2xl text-xl text-black/80
            font-semibold shadow-sm hover:shadow-md hover:bg-blue-500 hover:text-blue-50" onClick={()=> {setRul(!rul); setRulCounter(rulCounter + 1)}}>Rul {totalDice} terning</button>
                        )}
                    </div>
                </div>
                <div className="mt-4">
                <YatzySheet
                    size={1}
                    currentPlayers={[`Dig (${user || "Poul"})`,`Nuværende (${playersState[0] || "Peter"})`, `Bedste (${bestPlayerState || "Poul"})`, `Værste (${worstPlayerState || "Pil"})`]}
                    scores={yatzysheetState || {}}
                    previews={ YatzyPreview(diceNumbersState[0], diceNumbersState[1], diceNumbersState[2], diceNumbersState[3], diceNumbersState[4]) }
                    onCellClick={(category, playerIndex) => {
                        const previewResult: Partial<Record<YatzyCategory, Record<number, string | number>>> = YatzyPreview(
                            diceNumbersState[0],
                            diceNumbersState[1],
                            diceNumbersState[2],
                            diceNumbersState[3],
                            diceNumbersState[4]
                        );

                        const score = previewResult?.[category as keyof typeof previewResult]?.[playerIndex + 1];

                        switch(playerIndex) {
                            case 0:
                                if (playersState[0]===user) {
                                    fetch(`${apiBase}/api/tryk/${instanceId}/${user}`, {
                                        method: 'POST', headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ category: category, score: score })
                                    })
                                    if (category==="yatzy") {
                                        confettiTrigger()
                                    }
                                }
                                break;
                            case 1:
                                if (playersState[0]===user) {
                                    fetch(`${apiBase}/api/tryk/${instanceId}/${user}`, {
                                        method: 'POST', headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ category: category, score: score })
                                    })
                                    if (category === "yatzy" && ((typeof score === "string" ? parseInt(score) : score) ?? 0) > 0) {
                                        confettiTrigger()
                                    }
                                }
                                break;
                            case 2:
                                if (bestPlayerState===user && playersState[0]===user) {
                                    fetch(`${apiBase}/api/tryk/${instanceId}/${user}`, {
                                        method: 'POST', headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ category: category, score:score })
                                    })
                                    if (category === "yatzy" && ((typeof score === "string" ? parseInt(score) : score) ?? 0) > 0) {
                                        confettiTrigger()
                                    }
                                }
                                break;
                            case 3:
                                if (worstPlayerState===user && playersState[0]===user) {
                                    fetch(`${apiBase}/api/tryk/${instanceId}/${user}`, {
                                        method: 'POST', headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ category: category, score: score })
                                    })
                                    if (category === "yatzy" && ((typeof score === "string" ? parseInt(score) : score) ?? 0) > 0) {
                                        confettiTrigger()
                                    }
                                }
                        }
                        console.log(`Clicked ${category} for player ${playerIndex}`);
                    }}
                />
                </div>
            </div>
        </main>
            {!loggedIn && (
                <LoginPortal players={playersState} setLogin={setLoggedIn} apiBase={apiBase} instanceId={instanceId} setUser={setUser} setUserPassword={setPassword} />
            )}
            {clickedPlayer && clickedPlayer && (
                <ClickedPlayer instanceId={instanceId} apiBase={apiBase} clickedPlayerName={clickedPlayerName} setClickedPlayer={setClickedPlayer} players={playersState} />
            )}
        </>
)
}