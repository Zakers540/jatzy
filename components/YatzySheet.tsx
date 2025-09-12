//TODO: hvis ingen preview, kryds over på hover

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
            <td className="tablecell text-left"><span className="pr-20">{label}</span></td>
            {currentPlayers.map((_, i) => {
                const value = scores?.[category]?.[i];
                const preview = previews?.[category]?.[i];


                return (
                    <td
                        key={i}
                        className="tablecell cursor-pointer hover:bg-blue-50/40"
                        onClick={() => onCellClick(category, i)}
                    >
                        <span className="px-5 text-black/80">{value ?? <span className="text-neutral-400 hover:text-black/80">{preview ?? ""}</span>}</span>
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
            className="flex items-center justify-center mt-12"
            style={{ transform: `scale(${size})`, transformOrigin: "top left" }}
        >
            <div className="bg-white/80 rounded-lg shadow-md p-4">
                <table className="border-collapse">
                    <thead>
                    <tr>
                        <th className="text-left font-semibold text-3xl italic pb-2">yatzy</th>
                        {currentPlayers.map((currentPlayer, i) => (
                            <th key={i} className="tablecell font-semibold">
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
                    {renderRow("1par", "1 par")}
                    {renderRow("2par", "2 par")}
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
