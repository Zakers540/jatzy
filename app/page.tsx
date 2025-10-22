"use client"

import BigDice from "@/components/BigDice";
import {useEffect, useState} from "react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Card from "@/components/Card";
import AttentionSpan from "@/components/ui/Attention";

export default function Home() {
    const [diceNumber, setDiceNumber] = useState(6);
    const apiBase = process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:5328' : 'https://jatzy.vercel.app'
    useEffect(() => {
        const interval = setInterval(() => {
            setDiceNumber(Math.floor(Math.random() * 6) + 1);
        }, 2000);
        const timeCheck = (): void => {
            fetch(`${apiBase}/api/tjek/tid`)
            setInterval(() => {
                fetch(`${apiBase}/api/tjek/tid`)
            }, 24 * 60 * 60 * 1000);
        };

        timeCheck();
        return () => clearInterval(interval);
    }, []);
    return (
        <>
            <Navbar/>
            <div className="min-h-screen w-full flex flex-col items-center justify-center pt-24">
                <AttentionSpan className="" color="blue" size="lg">🎉 DU KAN NU SPILLE YATZY I GRUPPER 🎉</AttentionSpan>
                <main
                    className="min-h-screen w-full max-w-[1200px] flex flex-col pt-16 px-20 md:grid md:grid-cols-2 md:items-start">
                    <div className="flex flex-col items-center -mt-8 md:mt-8">
                        <div className="md:hidden flex justify-center mb-12 md:mt-0">
                            <BigDice diceNumber={diceNumber}/>
                        </div>
                        <h1 className="text-center text-black/80 text-4xl font-semibold bg-white/80 rounded-md p-2">
                            Har du også lyst til yatzy?
                        </h1>
                        <p className="text-center mt-2 text-md text-neutral-500 bg-white/60 rounded-md p-1">
                            Det har du selvfølgelig!
                        </p>
                        <a href="/api/opret" className="p-4 border-2 border-blue-500 rounded-2xl text-xl mt-8 text-black/80
            font-semibold shadow-sm hover:shadow-md hover:bg-blue-500 hover:text-blue-50">
                            Start et spil yatzy
                        </a>
                    </div>
                    <div className="hidden md:flex justify-center mt-24 md:mt-0">
                        <BigDice diceNumber={diceNumber}/>
                    </div>
                </main>
            </div>
            <Footer/>
        </>
    );
}
