"use client"

import { useState } from "react";

export default function YatzySheet({
                                       currentPlayers = ["Spiller 1", "Spiller 2"],
                                       size = 1,
                                       scores = {},
                                       previews = {},
                                       onCellClick = () => {}
                                   }) {
    const renderRow = (category, label) => (
        <tr>
            <td className="tablecell text-left">{label}</td>
            {currentPlayers.map((_, i) => {
                const value = scores[category]?.[i];
                const preview = previews[category]?.[i];

                return (
                    <td
                        key={i}
                        className={`tablecell cursor-pointer hover:bg-blue-200/40 transition-colors`}
                        onClick={() => onCellClick(category, i)}
                    >
                        {value ?? <span className="text-neutral-400">{preview ?? ""}</span>}
                    </td>
                );
            })}
        </tr>
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
                        <th className="tablecell text-left font-semibold">Kategori</th>
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
                    {renderRow("seksere", "Seksere")}
                    {renderRow("sum", "Sum")}
                    {renderRow("bonus", "Bonus")}
                    {renderRow("1par", "1 par")}
                    {renderRow("2par", "2 par")}
                    {renderRow("3ens", "3 ens")}
                    {renderRow("4ens", "4 ens")}
                    {renderRow("lillestraight", "Lille straight")}
                    {renderRow("storstraight", "Stor straight")}
                    {renderRow("fuldthus", "Fuldt hus")}
                    {renderRow("chance", "Chance")}
                    {renderRow("yatzy", "Yatzy")}
                    {renderRow("total", "Total")}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
