//TODO: hvis ingen preview, kryds over på hover
//TODO: gør så de kun kan få hover effekter og sender videre til backend hvis det er dem selv altså f.eks altid kunne de være 0

"use client";

import { useState } from "react";

type YatzyCategory =
    | "ettere"
    | "toere"
    | "treere"
    | "firere"
    | "femmere"
    | "seksere"
    | "sum"
    | "bonus"
    | "1par"
    | "2par"
    | "3ens"
    | "4ens"
    | "lillestraight"
    | "storstraight"
    | "fuldthus"
    | "chance"
    | "yatzy"
    | "total";

interface YatzySheetProps {
    currentPlayers?: string[];
    size?: number;
    scores?: Partial<Record<YatzyCategory, Record<number, number>>>;
    previews?: Partial<Record<YatzyCategory, Record<number, string | number>>>;
    onCellClick?: (category: YatzyCategory, playerIndex: number) => void;
}

export default function YatzySheet({
                                       currentPlayers = ["Spiller 1", "Spiller 2"],
                                       size = 1,
                                       scores = {},
                                       previews = {},
                                       onCellClick = () => {},
                                   }: YatzySheetProps) {
    const renderRow = (category: YatzyCategory, label: string, seperatorAfter?: boolean) => (
        <>
        <tr key={category}>
            <td className={`border border-l-0 px-3 py-1.5 font-semibold text-left ${(label === "Sum" || label === "Bonus" || label === "Total") ? "text-xs text-black" : "text-xs text-black/80"}`}><span className="pr-20">{label}</span></td>
            {currentPlayers.map((_, i) => {
                const value = scores?.[category]?.[i];
                const preview = previews?.[category]?.[i];


                return (
                    <td
                        key={i}
                        className="tablecell cursor-pointer hover:bg-blue-50/40 group text-center"
                        onClick={() => onCellClick(category, i)}
                    >
                        <div className={`px-4 group-hover:text-black/80
                            ${value ? "text-black/80" : preview ? "text-neutral-400" : ""} 
                            ${!value && !preview ? "group-hover:line-through" : ""}`}
                        >
                            {value || preview || '\u00A0'}
                        </div>
                    </td>

                );
            })}
        </tr>
            {seperatorAfter && (
                <tr>
                    <td colSpan={currentPlayers.length + 1} className="h-[1px] bg-black/80 p-0" />
                </tr>
            )}
        </>
    );

    return (
        <div
            className="flex items-start justify-center overflow-x-auto"
        >
            <div className="bg-white/80 rounded-lg shadow-sm p-4" style={{ transform: `scale(${size})`, transformOrigin: "center" }}>
                <table className="border-collapse">
                    <thead>
                    <tr>
                        <th className="text-left font-semibold text-xl italic pb-2">yatzy</th>
                        {currentPlayers.map((currentPlayer, i) => (
                            <th key={i} className=" px-3 py-1 text-xs text-black/70 font-semibold">
                                {currentPlayer}
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {renderRow("ettere", "Ettere")}
                    {renderRow("toere", "Toere")}
                    {renderRow("treere", "Treere")}
                    {renderRow("firere", "Firere")}
                    {renderRow("femmere", "Femmere")}
                    {renderRow("seksere", "Seksere", true)}
                    {renderRow("sum", "Sum")}
                    {renderRow("bonus", "Bonus", true)}
                    {renderRow("3ens", "3 ens")}
                    {renderRow("4ens", "4 ens")}
                    {renderRow("lillestraight", "Lille straight")}
                    {renderRow("storstraight", "Stor straight")}
                    {renderRow("fuldthus", "Fuldt hus")}
                    {renderRow("chance", "Chance")}
                    {renderRow("yatzy", "Yatzy", true)}
                    {renderRow("total", "Total")}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
