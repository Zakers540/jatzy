"use client"

import Link from "next/link";
import {useState} from "react";

export default function Navbar () {
    const [open, setOpen] = useState("");
    return (
        <>
            <nav className="z-10 fixed w-full">
                <div className="flex flex-col md:flex-row items-center justify-between w-full px-4 py-4">
                    <Link href="/">
                        <p className="italic text-3xl dark:text-white font-semibold">yatzy</p>
                    </Link>
                    <div className={`h-16 space-x-5 z-10 items-center justify-center flex pt-12 pb-8 md:pb-0 md:pt-0 ${open === "" ? "-my-8" : "-my-16 md:-my-8"}`}>
                        <div className="dropdown group">
                            <div className={`${open === "server" ? "block my-8" : "hidden group-hover:block my-8"}`}/>
                            <a className={`parent ${open === "server" ? "!shownparent" : "cursor-default"}`} onClick={() => {if (open === "server") {setOpen("")} else {setOpen("server")}}}>
                                Server
                            </a>
                            <div className={`${open === "server" ? "block my-8" : "hidden group-hover:block my-8"}`}/>
                            <div className={`dropdown-content ${open === "server" ? "!shown" : ""}`}>
                                <a href="/api/opret">
                                    Opret server
                                </a>
                                <a href="/server/deltag">
                                    Deltag i server
                                </a>
                            </div>
                        </div>
                        <a className="navlink" href="/regler">Yatsy regler/regler</a>
                        <a className="navlink" href="/hvordandetvirker">Hvordan det virker</a>
                    </div>
                </div>
            </nav>
            <nav className="backdrop-blur-lg fixed w-full bg-white/10 dark:bg-black/10">
                <div className="invisible flex flex-col md:flex-row items-center justify-between w-full px-4 py-4">
                    <p className="italic text-3xl font-semibold">yatzy</p>
                    <div className="invisible space-x-5 z-10 items-center flex-wrap justify-center flex pt-12 pb-8 md:pb-0 md:pt-0">
                        <a className="navlink" href="/opret">Server</a>
                        <a className="navlink" href="/regler">Yatsy regler</a>
                        <a className="navlink" href="/hvordandetvirker">Hvordan det virker</a>
                    </div>
                </div>
            </nav>
        </>
    )
}