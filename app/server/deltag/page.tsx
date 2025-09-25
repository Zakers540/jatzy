//"For at tilføje et navn på en server skal det være unikt" måske? eller anden tekst bedre? Anden tekst kortere.
"use client"
import Yatsy from "@/components/Yatsy";
import {useState} from "react";

export default function Server() {
    const [showWarning, setShowWarning] = useState(false);
    const [warning, setWarning] = useState("");
    const [instanceId, setInstanceId] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [exists, setExists] = useState(false);
    return (
        <main className="min-h-screen w-full flex flex-col items-center pt-20">
            { showWarning && warning && (
            <div className="flex flex-col items-center justify-center mb-12 bg-red-500/80 shadow-md rounded-md p-2">
                <p className="text-center text-md font-medium text-red-50 tracking-wide"><span className="mr-2 font-mono text-lg font-semibold">OBS!</span> {warning}</p>
            </div>)}
            <form className="max-w-md w-full flex flex-col gap-6">
                <h1 className="text-4xl font-semibold text-black/80 mb-4">Deltag i en server</h1>

                <div className="flex flex-col">
                    <label htmlFor="instanceId" className="text-black/60 mb-2">Hvad er server ID'et?</label>
                    <input
                        type="number"
                        placeholder="123456"
                        className="input"
                    />
                </div>

                <div className="flex flex-col">
                    <label htmlFor="name" className="text-black/60 mb-2">Hvad ville du blive kaldt?</label>
                    <input
                        type="text"
                        placeholder="Poul"
                        className="input"
                    />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="name" className="text-black/60 mb-2">Hvad skal din adgangskode være?</label>
                    <input
                        type="text"
                        placeholder="Adgangskode"
                        className="input"
                    />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="name" className="text-black/60 mb-2">Bekræft din adgangskode.</label>
                    <input
                        type="text"
                        placeholder="Bekræft adgangskode"
                        className="input"
                    />
                </div>

                <button
                    type="submit"
                    className="p-2 border-2 border-blue-500 rounded-2xl text-xl mt-8 text-black/80
            font-semibold shadow-sm hover:shadow-md hover:bg-blue-500 hover:text-blue-50"
                    onClick={() => {
                        fetch(`https://jatzy.vercel.app/api/tjek/${instanceId}/${name}/${password}`)
                            .then((response) => response.json())
                            .then((data) => {
                                setExists(data.exists)
                                setWarning(data.warning);
                                setShowWarning(data.showWarning);
                            })
                    }}
                >
                    Deltag
                </button>
            </form>
            <div className="mt-12"/>
        </main>
    )
}
