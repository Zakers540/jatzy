"use client"

import {useGSAP} from "@gsap/react";
import gsap from "gsap";

type DiceProps = {
    diceNumber: number
}

export default function BigDice({ diceNumber }: DiceProps) {
    useGSAP(()=> {
        gsap.fromTo(".dot", {
            filter: "blur(25px)",
            duration: 0.4,
            ease: "Power2.easeIn",
        }, {
            filter: "blur(0px)",
            duration: 0.4,
            ease: "Power2.easeOut",
        })
    }, [diceNumber])
    return (
        <div className="flex justify-center items-center border rounded-md w-32 h-32 md:rounded-lg md:w-64 md:h-64 bg-neutral-50">
            {(() => {
                switch (diceNumber) {
                    case 1:
                        return (
                            <div className="w-full h-full flex justify-center items-center">
                                <div className="dot w-6 h-6 md:w-12 md:h-12 bg-black rounded-full" />
                            </div>
                        )
                    case 2:
                        return (
                            <div className="w-full h-full flex justify-between items-center flex-col p-4 md:p-8 py-6 md:py-12">
                                <div className="dot w-6 h-6 md:w-12 md:h-12 bg-black rounded-full" />
                                <div className="dot w-6 h-6 md:w-12 md:h-12 bg-black rounded-full" />
                            </div>
                        )
                    case 3:
                        return (
                            <div className="w-full h-full flex flex-col justify-between p-4 md:p-8">
                                <div className="flex justify-start">
                                    <div className="dot w-6 h-6 md:w-12 md:h-12 bg-black rounded-full" />
                                </div>
                                <div className="flex justify-center">
                                    <div className="dot w-6 h-6 md:w-12 md:h-12 bg-black rounded-full" />
                                </div>
                                <div className="flex justify-end">
                                    <div className="dot w-6 h-6 md:w-12 md:h-12 bg-black rounded-full" />
                                </div>
                            </div>
                        )
                    case 4:
                        return (
                            <div className="w-full h-full grid grid-cols-2 gap-4 p-4 py-3 md:gap-8 md:p-8 md:py-6 place-items-center">
                                <div className="dot w-6 h-6 md:w-12 md:h-12 bg-black rounded-full" />
                                <div className="dot w-6 h-6 md:w-12 md:h-12 bg-black rounded-full" />
                                <div className="dot w-6 h-6 md:w-12 md:h-12 bg-black rounded-full" />
                                <div className="dot w-6 h-6 md:w-12 md:h-12 bg-black rounded-full" />
                            </div>
                        )
                    case 5:
                        return (
                            <div className="w-full h-full grid grid-cols-3 grid-rows-3 p-4 py-3 md:p-8 md:py-6 place-items-center">
                                <div className="dot w-6 h-6 md:w-12 md:h-12 bg-black rounded-full" />
                                <div />
                                <div className="dot w-6 h-6 md:w-12 md:h-12 bg-black rounded-full" />
                                <div />
                                <div className="dot w-6 h-6 md:w-12 md:h-12 bg-black rounded-full" />
                                <div />
                                <div className="dot w-6 h-6 md:w-12 md:h-12 bg-black rounded-full" />
                                <div />
                                <div className="dot w-6 h-6 md:w-12 md:h-12 bg-black rounded-full" />
                            </div>
                        )
                    case 6:
                        return (
                            <div className="w-full h-full grid grid-cols-2 gap-y-4 md:gap-y-8 md:p-8 p-4 py-3 md:py-6 place-items-center">
                                <div className="dot w-6 h-6 md:w-12 md:h-12 bg-black rounded-full" />
                                <div className="dot w-6 h-6 md:w-12 md:h-12 bg-black rounded-full" />
                                <div className="dot w-6 h-6 md:w-12 md:h-12 bg-black rounded-full" />
                                <div className="dot w-6 h-6 md:w-12 md:h-12 bg-black rounded-full" />
                                <div className="dot w-6 h-6 md:w-12 md:h-12 bg-black rounded-full" />
                                <div className="dot w-6 h-6 md:w-12 md:h-12 bg-black rounded-full" />
                            </div>
                        )
                }
            })()}
        </div>
    )
}