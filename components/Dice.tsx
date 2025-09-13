//tilføj hurtigskiftende tilfældige number før endelig tal for gambling effekt
"use client"

import {useGSAP} from "@gsap/react";
import gsap from "gsap";
import {useEffect, useState} from "react";

type DiceProps = {
    realDiceNumber: number
    size?: number
}

export default function Dice({ realDiceNumber, size }: DiceProps) {
    const [gamblingEffect, setGamblingEffect] = useState(true)
    const [diceNumber, setDiceNumber] = useState(6)
    const [randomInterval, setRandomInterval] = useState(1)
    const [randomTimeout, setRandomTimeout] = useState(1)
    useGSAP(()=> {
        gsap.fromTo(".dot", {
            filter: "blur(2px)",
            duration: 0.4,
        }, {
            filter: "blur(0px)",
        })
    }, [diceNumber])
    useEffect(() => {
        setGamblingEffect(true)
        setRandomInterval(Math.floor(Math.random() * 250) + 150)
        setRandomTimeout(400-randomInterval*10)

        const interval = setInterval(() => {
            setDiceNumber(Math.floor(Math.random() * 6) + 1);
        }, randomInterval);

        const timeout = setTimeout(() => {
            clearInterval(interval);
            setGamblingEffect(false)
            setDiceNumber(1);
            clearTimeout(timeout)
        }, randomTimeout);
    }, [realDiceNumber]);

    return (
        <div className="-z-10 flex justify-center items-center border-2 rounded-lg w-16 h-16 bg-neutral-50" style={{transform: `scale(${size})`}}>
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
    )
}