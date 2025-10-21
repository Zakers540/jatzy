//TODO: at enter functionality

import {Dispatch, SetStateAction, useEffect, useState} from "react";
import {useGSAP} from "@gsap/react";
import gsap from "gsap";

type LoginPortalProps = {
    players?: string[];
    apiBase: string;
    instanceId: string;
    setLogin: Dispatch<SetStateAction<boolean>>;
    setUser?: Dispatch<SetStateAction<string>>;
    setUserPassword?: Dispatch<SetStateAction<string>>;
}

export default function LoginPortal({players, apiBase, instanceId, setLogin, setUser, setUserPassword}: LoginPortalProps) {
    const [selectedOpret, setSelectedOpret] = useState<boolean>(false);
    const [selectedPlayer, setSelectedPlayer] = useState<boolean>(false)
    const [playerName, setPlayerName] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [confirmPassword, setConfirmPassword] = useState<string>("")
    const [error, setError] = useState<string>("")
    const [errorExists, setErrorExists] = useState<boolean>(false)
    const [exit, setExit] = useState<boolean>(false)
    const [loading, setLoading] = useState(false)

    useGSAP(()=>{
        gsap.from(".alert", {
            opacity: 0.5,
            duration: 1,
            ease: "easeOutExpo",
            y: -10
        })
    }, [errorExists])

    useGSAP(()=>{
            gsap.to(".alert", {
                opacity: 0,
                duration: 1,
                ease: "easeOutExpo",
                y: 10
            })
        }, [errorExists])

         useEffect(() => {
            setTimeout(()=>{
            setTimeout(()=>{
                setErrorExists(false)
            }, 6000)
        }, 14000)
    }, [errorExists])
    return (
        <>
            <main className="fixed inset-0 z-50 flex flex-col items-center justify-center backdrop-blur-sm bg-black/5">
                {errorExists && (selectedOpret || players && players[0]==="" || !players) && (
                    <div className="alert fixed top-4 items-center justify-center mb-12 bg-red-500/80 shadow-md rounded-md p-2">
                        <p className="text-center text-md font-medium text-red-50 tracking-wide"><span className="mr-2 font-mono text-lg font-semibold">OBS!</span> {error}</p>
                    </div>
                )}
                <div className="bg-white/64 p-8 max-w-lg w-full rounded-md max-h-124 border-1 border-white/80">
                    { players && !(players[0]==="") && !selectedOpret && !selectedPlayer ? (
                        <div className="flex flex-col px-4">
                            <div>
                                <h2 className="font-medium text-center text-xl mb-6 cursor-default">Vælg bruger</h2>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                {players.map((player, i) => (
                                    <button key={i} className="shadow-sm bg-white/20 hover:bg-blue-500/40 w-32 h-16 rounded-sm border-1 border-white/80 text-md text-black/80" onClick={() => {setSelectedPlayer(true); setPlayerName(player)}}>{player}</button>
                                    )
                                )}
                            </div>
                            <div className="mt-6"><span className="text-black/80">Har du ikke en bruger?</span> <button className="text-black/80 font-medium hover:text-blue-500" onClick={()=> {setSelectedOpret(true)}}>Opret en</button> </div>
                        </div>
                    ) : selectedOpret || players && players[0]==="" || !players ? (
                        <div>
                            <h2 className="text-center text-xl font-medium mb-6 cursor-default">Opret en spiller</h2>
                            <div className="w-full flex flex-col gap-4">
                                <div className="flex flex-col">
                                    <label htmlFor="name" className="text-black/60 mb-2">Hvad ville du blive kaldt?</label>
                                    <input
                                        type="text"
                                        placeholder="Poul"
                                        value={playerName}
                                        className="input"
                                        onChange={(e) => setPlayerName(e.target.value)}
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="name" className="text-black/60 mb-2">Hvad skal din adgangskode være?</label>
                                    <input
                                        type="password"
                                        placeholder="Adgangskode"
                                        value={password}
                                        className="input"
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="name" className="text-black/60 mb-2">Bekræft din adgangskode.</label>
                                    <input
                                        type="password"
                                        placeholder="Bekræft adgangskode"
                                        className="input"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="p-2 border-2 border-blue-500 rounded-2xl text-xl mt-6 text-black/80
                                       font-semibold shadow-sm hover:shadow-md hover:bg-blue-500 hover:text-blue-50"
                                    onClick={() => {
                                        if (password === confirmPassword) {
                                        setLoading(true)
                                        fetch(`${apiBase}/api/tilfoej`, {
                                            method: "POST",
                                            headers: {"Content-Type": "application/json"},
                                            body: JSON.stringify({
                                                instanceId: instanceId,
                                                user: playerName,
                                                password: password,
                                            })
                                        })
                                            .then((response) => response.json())
                                            .then((data) => {
                                                setLogin(data.login)
                                                setErrorExists(data.errorExists)
                                                setError(data.error)
                                                if (data.login) {
                                                    try { setUser && setUser(playerName); setUserPassword && setUserPassword(password); } catch (e) {}
                                                }
                                            })
                                            .then(function (data) {setLoading(false)})
                                        } else {setErrorExists(true); setError("Adgangskode og bekræftet adgangskode er ikke det samme.");}
                                    }}
                                >
                                    Opret
                                </button>
                            </div>
                            { players && !(players[0]==="") && (
                            <div className="mt-6"><span className="text-black/80">Ville du gå tilbage?</span> <button className="text-black/80 font-medium hover:text-blue-500" onClick={()=> {setSelectedOpret(false); setSelectedPlayer(false)}}>Gå tilbage</button> </div>
                            )}
                        </div>
                    ) : (
                        <div>
                            <h2 className="text-center text-xl font-medium mb-16 cursor-default">Deltag som {playerName}</h2>
                            <div className="w-full flex flex-col gap-4">
                                <div className="flex flex-col">
                                    <label htmlFor="name" className="text-black/60 mb-2">Hvad er din adgangskode?</label>
                                    <input
                                        type="password"
                                        placeholder="Adgangskode"
                                        className="input"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="p-2 border-2 border-blue-500 rounded-2xl text-xl mt-16 text-black/80
                                       font-semibold shadow-sm hover:shadow-md hover:bg-blue-500 hover:text-blue-50"
                                    onClick={() => {
                                        setLoading(true)
                                        fetch(`${apiBase}/api/tjek/${instanceId}/${encodeURIComponent(playerName)}`)
                                            .then((response) => response.json())
                                            .then((data) => {
                                                setLogin(data.login)
                                                setErrorExists(data.errorExists)
                                                setError(data.error)
                                                if (data.login) {
                                                    try { setUser && setUser(playerName); setUserPassword && setUserPassword(password); } catch (e) {}
                                                }
                                            })
                                            .then(function (data) {setLoading(false)})
                                    }}
                                >
                                    Deltag
                                </button>
                            </div>
                            <div className="mt-6"><span className="text-black/80">Ville du gå tilbage?</span> <button className="text-black/80 font-medium hover:text-blue-500" onClick={()=> {setSelectedOpret(false); setSelectedPlayer(false)}}>Gå tilbage</button> </div>
                        </div>
                    )}
                </div>
            </main>
            {loading && (
                <div className="fixed inset-0 z-100 flex flex-col items-center justify-center">
                    <div className="🤚">
                        <div className="👉"></div>
                        <div className="👉"></div>
                        <div className="👉"></div>
                        <div className="👉"></div>
                        <div className="🌴"></div>
                        <div className="👍"></div>
                    </div>
                </div>
            )}
        </>
    )
}