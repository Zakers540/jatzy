"use client"

import {useGSAP} from "@gsap/react";
import gsap from "gsap";
import {Dispatch, SetStateAction, useEffect, useState} from "react";

type DiceProps = {
    realDiceNumber: number
    size?: number
    selected?: boolean
    setSelected?: Dispatch<SetStateAction<boolean>>
    user?: string
    currentPlayers?: string[]
}

export default function Dice({ realDiceNumber, size, selected, setSelected, user, currentPlayers }: DiceProps) {
    const [gamblingEffect, setGamblingEffect] = useState(true)
    const [diceNumber, setDiceNumber] = useState(6)
    useEffect(() => {
        const randomInterval: number = Math.floor(Math.random() * 50) + 200;
        const randomTimeout: number = (250 - randomInterval) * 100;
        setGamblingEffect(true)

        const interval = setInterval(() => {
            setDiceNumber(Math.floor(Math.random() * 6) + 1);
        }, randomInterval);

        const timeout = setTimeout(() => {
            clearInterval(interval);
            setGamblingEffect(false)
            setDiceNumber(realDiceNumber);
            clearTimeout(timeout)
        }, randomTimeout);
    }, [realDiceNumber]);

    return (
        <> { currentPlayers && user && user === currentPlayers[0] ? (
            <div className={`flex justify-center items-center border-2 rounded-lg w-16 h-16 group ${selected ? "bg-blue-200/40" : "bg-neutral-50 hover:cursor-not-allowed hover:bg-red-200/40"}`} style={{transform: `scale(${size})`}}>
                {(() => {
                    switch (diceNumber) {
                        case 1:
                            return (
                                <div className="w-full h-full flex justify-center items-center">
                                    <div className={`${gamblingEffect ? "w-3 h-3 bg-black rounded-full" : "dot w-3 h-3 bg-black rounded-full"}`} />
                                </div>
                            )
                        case 2:
                            return (
                                <div className="w-full h-full flex justify-between items-center flex-col p-2 py-3">
                                    <div className={`${gamblingEffect ? "w-3 h-3 bg-black rounded-full" : "dot w-3 h-3 bg-black rounded-full"}`} />
                                    <div className={`${gamblingEffect ? "w-3 h-3 bg-black rounded-full" : "dot w-3 h-3 bg-black rounded-full"}`} />
                                </div>
                            )
                        case 3:
                            return (
                                <div className="w-full h-full flex flex-col justify-between p-2">
                                    <div className="flex justify-start">
                                        <div className={`${gamblingEffect ? "w-3 h-3 bg-black rounded-full" : "dot w-3 h-3 bg-black rounded-full"}`} />
                                    </div>
                                    <div className="flex justify-center">
                                        <div className={`${gamblingEffect ? "w-3 h-3 bg-black rounded-full" : "dot w-3 h-3 bg-black rounded-full"}`} />
                                    </div>
                                    <div className="flex justify-end">
                                        <div className={`${gamblingEffect ? "w-3 h-3 bg-black rounded-full" : "dot w-3 h-3 bg-black rounded-full"}`} />
                                    </div>
                                </div>
                            )
                        case 4:
                            return (
                                <div className="w-full h-full grid grid-cols-2 gap-2 p-2 py-1.5 place-items-center">
                                    <div className={`${gamblingEffect ? "w-3 h-3 bg-black rounded-full" : "dot w-3 h-3 bg-black rounded-full"}`} />
                                    <div className={`${gamblingEffect ? "w-3 h-3 bg-black rounded-full" : "dot w-3 h-3 bg-black rounded-full"}`} />
                                    <div className={`${gamblingEffect ? "w-3 h-3 bg-black rounded-full" : "dot w-3 h-3 bg-black rounded-full"}`} />
                                    <div className={`${gamblingEffect ? "w-3 h-3 bg-black rounded-full" : "dot w-3 h-3 bg-black rounded-full"}`} />
                                </div>
                            )
                        case 5:
                            return (
                                <div className="w-full h-full grid grid-cols-3 grid-rows-3 p-2 py-1.5 place-items-center">
                                    <div className={`${gamblingEffect ? "w-3 h-3 bg-black rounded-full" : "dot w-3 h-3 bg-black rounded-full"}`} />
                                    <div />
                                    <div className={`${gamblingEffect ? "w-3 h-3 bg-black rounded-full" : "dot w-3 h-3 bg-black rounded-full"}`} />
                                    <div />
                                    <div className={`${gamblingEffect ? "w-3 h-3 bg-black rounded-full" : "dot w-3 h-3 bg-black rounded-full"}`} />
                                    <div />
                                    <div className={`${gamblingEffect ? "w-3 h-3 bg-black rounded-full" : "dot w-3 h-3 bg-black rounded-full"}`} />
                                    <div />
                                    <div className={`${gamblingEffect ? "w-3 h-3 bg-black rounded-full" : "dot w-3 h-3 bg-black rounded-full"}`} />
                                </div>
                            )
                        case 6:
                            return (
                                <div className="w-full h-full grid grid-cols-2 gap-y-2 p-2 py-1.5 place-items-center">
                                    <div className={`${gamblingEffect ? "w-3 h-3 bg-black rounded-full" : "dot w-3 h-3 bg-black rounded-full"}`} />
                                    <div className={`${gamblingEffect ? "w-3 h-3 bg-black rounded-full" : "dot w-3 h-3 bg-black rounded-full"}`} />
                                    <div className={`${gamblingEffect ? "w-3 h-3 bg-black rounded-full" : "dot w-3 h-3 bg-black rounded-full"}`} />
                                    <div className={`${gamblingEffect ? "w-3 h-3 bg-black rounded-full" : "dot w-3 h-3 bg-black rounded-full"}`} />
                                    <div className={`${gamblingEffect ? "w-3 h-3 bg-black rounded-full" : "dot w-3 h-3 bg-black rounded-full"}`} />
                                    <div className={`${gamblingEffect ? "w-3 h-3 bg-black rounded-full" : "dot w-3 h-3 bg-black rounded-full"}`} />
                                </div>
                            )
                    }
                })()}
            </div>
            ) :(
            <div className={`flex justify-center items-center border-2 rounded-lg w-16 h-16 group ${selected ? "bg-blue-200/40" : "bg-neutral-50 hover:bg-blue-200/40 "}`} style={{transform: `scale(${size})`}} onClick={() => {setGamblingEffect(false); setSelected && setSelected(!selected)}}>
                {(() => {
                    switch (diceNumber) {
                        case 1:
                            return (
                                <div className="w-full h-full flex justify-center items-center">
                                    <div className={`${gamblingEffect ? "w-3 h-3 bg-black rounded-full" : "dot w-3 h-3 bg-black rounded-full"}`} />
                                </div>
                            )
                        case 2:
                            return (
                                <div className="w-full h-full flex justify-between items-center flex-col p-2 py-3">
                                    <div className={`${gamblingEffect ? "w-3 h-3 bg-black rounded-full" : "dot w-3 h-3 bg-black rounded-full"}`} />
                                    <div className={`${gamblingEffect ? "w-3 h-3 bg-black rounded-full" : "dot w-3 h-3 bg-black rounded-full"}`} />
                                </div>
                            )
                        case 3:
                            return (
                                <div className="w-full h-full flex flex-col justify-between p-2">
                                    <div className="flex justify-start">
                                        <div className={`${gamblingEffect ? "w-3 h-3 bg-black rounded-full" : "dot w-3 h-3 bg-black rounded-full"}`} />
                                    </div>
                                    <div className="flex justify-center">
                                        <div className={`${gamblingEffect ? "w-3 h-3 bg-black rounded-full" : "dot w-3 h-3 bg-black rounded-full"}`} />
                                    </div>
                                    <div className="flex justify-end">
                                        <div className={`${gamblingEffect ? "w-3 h-3 bg-black rounded-full" : "dot w-3 h-3 bg-black rounded-full"}`} />
                                    </div>
                                </div>
                            )
                        case 4:
                            return (
                                <div className="w-full h-full grid grid-cols-2 gap-2 p-2 py-1.5 place-items-center">
                                    <div className={`${gamblingEffect ? "w-3 h-3 bg-black rounded-full" : "dot w-3 h-3 bg-black rounded-full"}`} />
                                    <div className={`${gamblingEffect ? "w-3 h-3 bg-black rounded-full" : "dot w-3 h-3 bg-black rounded-full"}`} />
                                    <div className={`${gamblingEffect ? "w-3 h-3 bg-black rounded-full" : "dot w-3 h-3 bg-black rounded-full"}`} />
                                    <div className={`${gamblingEffect ? "w-3 h-3 bg-black rounded-full" : "dot w-3 h-3 bg-black rounded-full"}`} />
                                </div>
                            )
                        case 5:
                            return (
                                <div className="w-full h-full grid grid-cols-3 grid-rows-3 p-2 py-1.5 place-items-center">
                                    <div className={`${gamblingEffect ? "w-3 h-3 bg-black rounded-full" : "dot w-3 h-3 bg-black rounded-full"}`} />
                                    <div />
                                    <div className={`${gamblingEffect ? "w-3 h-3 bg-black rounded-full" : "dot w-3 h-3 bg-black rounded-full"}`} />
                                    <div />
                                    <div className={`${gamblingEffect ? "w-3 h-3 bg-black rounded-full" : "dot w-3 h-3 bg-black rounded-full"}`} />
                                    <div />
                                    <div className={`${gamblingEffect ? "w-3 h-3 bg-black rounded-full" : "dot w-3 h-3 bg-black rounded-full"}`} />
                                    <div />
                                    <div className={`${gamblingEffect ? "w-3 h-3 bg-black rounded-full" : "dot w-3 h-3 bg-black rounded-full"}`} />
                                </div>
                            )
                        case 6:
                            return (
                                <div className="w-full h-full grid grid-cols-2 gap-y-2 p-2 py-1.5 place-items-center">
                                    <div className={`${gamblingEffect ? "w-3 h-3 bg-black rounded-full" : "dot w-3 h-3 bg-black rounded-full"}`} />
                                    <div className={`${gamblingEffect ? "w-3 h-3 bg-black rounded-full" : "dot w-3 h-3 bg-black rounded-full"}`} />
                                    <div className={`${gamblingEffect ? "w-3 h-3 bg-black rounded-full" : "dot w-3 h-3 bg-black rounded-full"}`} />
                                    <div className={`${gamblingEffect ? "w-3 h-3 bg-black rounded-full" : "dot w-3 h-3 bg-black rounded-full"}`} />
                                    <div className={`${gamblingEffect ? "w-3 h-3 bg-black rounded-full" : "dot w-3 h-3 bg-black rounded-full"}`} />
                                    <div className={`${gamblingEffect ? "w-3 h-3 bg-black rounded-full" : "dot w-3 h-3 bg-black rounded-full"}`} />
                                </div>
                            )
                    }
                })()}
            </div>)}
        </>
    )
}