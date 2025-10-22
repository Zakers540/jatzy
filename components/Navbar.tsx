"use client"

import Link from "next/link";
import {useEffect, useState} from "react";
import { useRouter } from 'next/navigation'
import {useGSAP} from "@gsap/react";
import gsap from "gsap";
import {ScrollTrigger} from "gsap/all"

gsap.registerPlugin(ScrollTrigger)

export default function Navbar () {
    const [open, setOpen] = useState("");
    const router = useRouter()
    useEffect(()=> {
        router.prefetch('/hvordandetvirker')
    })
    useGSAP(()=>{
        gsap.to(".navbarlayer", {
            backdropFilter: "blur(8px)",
            borderBottom: "1px solid rgba(17, 24, 39, 0.1)",
            backgroundColor: "rgba(17, 24, 39, 0.02)",
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
                trigger: "body",
                start: "top+=50 top",
                end: "+=200",
                scrub: true,
                toggleActions: "play none none reverse",
            },
        });

    })
    return (
        <>
            <nav className="z-1000 fixed w-full">
                <div className="flex flex-col md:flex-row items-center justify-between w-full px-4 py-4">
                    <Link href="/">
                        <p className="italic text-3xl dark:text-white font-semibold">yatzy</p>
                    </Link>
                    <div className="h-24 space-x-5 z-10 items-center justify-center flex flex-wrap pt-12 pb-8 md:pb-0 md:pt-0 -my-8">
                        <a className="navlink" href="/api/opret">Opret server</a>
                        <a className="navlink" href="/regler">Yatsy regler/regler</a>
                        <a className="navlink" href="/hvordandetvirker">Hvordan det virker</a>
                    </div>
                </div>
            </nav>
            <nav className="fixed w-full z-100 navbarlayer">
                <div className="invisible flex flex-col md:flex-row items-center justify-between w-full px-4 py-4">
                    <p className="italic text-3xl font-semibold">yatzy</p>
                    <div className="invisible space-x-5 z-10 items-center flex-wrap justify-center flex pt-6 md:pb-0 md:pt-0 -my-8">
                        <a className="navlink" href="/opret">Opret server</a>
                        <a className="navlink" href="/regler">Yatsy regler</a>
                        <a className="navlink" href="/hvordandetvirker">Hvordan det virker</a>
                    </div>
                </div>
            </nav>
        </>
    )
}