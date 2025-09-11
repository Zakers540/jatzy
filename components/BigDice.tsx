"use client"

import {useGSAP} from "@gsap/react";
import gsap from "gsap";

type DiceProps = {
    diceNumber: number
}

export default function BigDice({ diceNumber }: DiceProps) {
    useGSAP(()=> {
        gsap.fromTo(".dot", {
            opacity: 0.5,
            duration: 0.4,
            ease: "Power2.easeIn",
        }, {
            opacity: 1,
            duration: 0.4,
            ease: "Power2.easeIn",
        })
    }, [diceNumber])
    return (
        <div className="flex justify-center items-center border rounded-lg w-64 h-64 bg-neutral-50">
            {(() => {
                switch (diceNumber) {
                    case 1:
                        return (
                            <div className="w-full h-full flex justify-center items-center">
                                <div className="dot w-12 h-12 bg-black rounded-full" />
                            </div>
                        )
                    case 2:
                        return (
                            <div className="w-full h-full flex justify-between items-center flex-col p-8 py-12">
                                <div className="dot w-12 h-12 bg-black rounded-full" />
                                <div className="dot w-12 h-12 bg-black rounded-full" />
                            </div>
                        )
                    case 3:
                        return (
                            <div className="w-full h-full flex flex-col justify-between p-8">
                                <div className="flex justify-start">
                                    <div className="dot w-12 h-12 bg-black rounded-full" />
                                </div>
                                <div className="flex justify-center">
                                    <div className="dot w-12 h-12 bg-black rounded-full" />
                                </div>
                                <div className="flex justify-end">
                                    <div className="dot w-12 h-12 bg-black rounded-full" />
                                </div>
                            </div>
                        )
                    case 4:
                        return (
                            <div className="w-full h-full grid grid-cols-2 gap-8 p-8 py-6 place-items-center">
                                <div className="dot w-12 h-12 bg-black rounded-full" />
                                <div className="dot w-12 h-12 bg-black rounded-full" />
                                <div className="dot w-12 h-12 bg-black rounded-full" />
                                <div className="dot w-12 h-12 bg-black rounded-full" />
                            </div>
                        )
                    case 5:
                        return (
                            <div className="w-full h-full grid grid-cols-3 grid-rows-3 p-8 py-6 place-items-center">
                                <div className="dot w-12 h-12 bg-black rounded-full" />
                                <div />
                                <div className="dot w-12 h-12 bg-black rounded-full" />
                                <div />
                                <div className="dot w-12 h-12 bg-black rounded-full" />
                                <div />
                                <div className="dot w-12 h-12 bg-black rounded-full" />
                                <div />
                                <div className="dot w-12 h-12 bg-black rounded-full" />
                            </div>
                        )
                    case 6:
                        return (
                            <div className="w-full h-full grid grid-cols-2 gap-y-8 p-8 py-6 place-items-center">
                                <div className="dot w-12 h-12 bg-black rounded-full" />
                                <div className="dot w-12 h-12 bg-black rounded-full" />
                                <div className="dot w-12 h-12 bg-black rounded-full" />
                                <div className="dot w-12 h-12 bg-black rounded-full" />
                                <div className="dot w-12 h-12 bg-black rounded-full" />
                                <div className="dot w-12 h-12 bg-black rounded-full" />
                            </div>
                        )
                }
            })()}
        </div>
    )
}