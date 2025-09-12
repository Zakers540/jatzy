"use client"

import {useGSAP} from "@gsap/react";
import gsap from "gsap";
import {ScrollTrigger, SplitText} from 'gsap/all';

type AsideProps = {
    position?: "left" | "right",
    digit: string,
    title: string,
    text: string
}

gsap.registerPlugin(ScrollTrigger)

export default function Aside({position, digit, title, text}: AsideProps) {
    useGSAP(()=>{
        const boxes = document.querySelectorAll(".box")
        const pelement = document.querySelectorAll(".box p")
        const h3element = document.querySelectorAll(".box h3")
        boxes.forEach(box => {
            gsap.fromTo(box,
                {
                    opacity: 0,
                    y: 30
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    scrollTrigger: {
                        trigger: box,
                        start: "top 50%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        })
        h3element.forEach((h3) => {
            const h3split = new SplitText(h3, {type: "chars"})

            gsap.from(h3split.chars, {
                duration: 0.4,
                ease: "expo.out",
                y: -4,
                opacity: 0,
                scrollTrigger: {
                    trigger: h3,
                    start: "top 80%"
                },
                stagger: 0.02,
            })
        })
        pelement.forEach((p) => {
            const psplit = new SplitText(p, {type: "lines"})

            gsap.from(psplit.lines, {
                delay: 0.2,
                duration: 0.4,
                ease: "expo.out",
                xPercent: -2,
                autoAlpha: 0,
                scrollTrigger: {
                    trigger: p,
                    start: "top 80%"
                },
                stagger: 0.1,
            })
        })
    })
    return (
        <aside className="-z-10 grid-cols-2 min-h-[88vh]">
            {position === "right" && (
                <div className="flex flex-col w-full"></div>
            )}
            <div className={`flex flex-col box ${position === "left" ? "items-end" : "items-start"}`}>
                <h2 className="font-mono font-semibold text-6xl text-black/80 mb-6 p-2 bg-white/80 rounded-md border-1 border-black/20 shadow-sm">{digit}</h2>
                <div className="bg-white/80 p-8 rounded-md shadow-sm border-1 border-black/20">
                    <h3 className="text-6xl tracking-tighter font-medium mb-4 text-shadow-xs text-shadow-current">{title}</h3>
                    <p className={`text-3xl ${position === "left" ? "w-160" : "w-160"}` }>{text}</p>
                </div>
            </div>
        </aside>
    )
}