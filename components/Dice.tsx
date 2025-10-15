"use client"

import React, { Dispatch, SetStateAction, useEffect, useState } from "react";

type DiceProps = {
  realDiceNumber: number;
  size?: number;
  selected?: boolean;
  // Expect a "React" style setter that accepts boolean | updater
  setSelected?: Dispatch<SetStateAction<boolean>>;
  user?: string;
  currentPlayers?: string[];
};

export default function Dice({
  realDiceNumber,
  size = 1,
  selected = false,
  setSelected,
  user,
  currentPlayers,
}: DiceProps) {
  const [gamblingEffect, setGamblingEffect] = useState(true);
  const [diceNumber, setDiceNumber] = useState<number>(6);

  useEffect(() => {
    // use ReturnType to get the right timer type for the environment
    const randomInterval = Math.floor(Math.random() * 50) + 200;
    const randomTimeout = (250 - randomInterval) * 100;

    setGamblingEffect(true);

    const interval: ReturnType<typeof setInterval> = setInterval(() => {
      setDiceNumber(Math.floor(Math.random() * 6) + 1);
    }, randomInterval);

    const timeout: ReturnType<typeof setTimeout> = setTimeout(() => {
      clearInterval(interval);
      setGamblingEffect(false);
      setDiceNumber(realDiceNumber);
    }, randomTimeout);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [realDiceNumber]);

  const handleClickToggle = () => {
    // Use the functional updater form — this is compatible with
    // setSelected being a Dispatch<SetStateAction<boolean>>
    if (setSelected) setSelected(prev => !prev);
    // also stop gambling effect visually
    setGamblingEffect(false);
  };

  const commonWrapper = (content: React.ReactNode, clickable = true) => (
    <div
      className={`flex justify-center items-center border-2 rounded-lg w-16 h-16 group ${
        selected ? "bg-blue-200/40" : "bg-neutral-50 hover:bg-blue-200/40 "
      }`}
      style={{ transform: `scale(${size})` }}
      onClick={clickable ? handleClickToggle : undefined}
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
    >
      {content}
    </div>
  );

  const dot = (
    <div className={`${gamblingEffect ? "w-3 h-3 bg-black rounded-full" : "dot w-3 h-3 bg-black rounded-full"}`} />
  );

  const renderDice = () => {
    switch (diceNumber) {
      case 1:
        return <div className="w-full h-full flex justify-center items-center">{dot}</div>;
      case 2:
        return (
          <div className="w-full h-full flex justify-between items-center flex-col p-2 py-3">
            {dot}
            {dot}
          </div>
        );
      case 3:
        return (
          <div className="w-full h-full flex flex-col justify-between p-2">
            <div className="flex justify-start">{dot}</div>
            <div className="flex justify-center">{dot}</div>
            <div className="flex justify-end">{dot}</div>
          </div>
        );
      case 4:
        return (
          <div className="w-full h-full grid grid-cols-2 gap-2 p-2 py-1.5 place-items-center">
            {dot}
            {dot}
            {dot}
            {dot}
          </div>
        );
      case 5:
        return (
          <div className="w-full h-full grid grid-cols-3 grid-rows-3 p-2 py-1.5 place-items-center">
            {dot}
            <div />
            {dot}
            <div />
            {dot}
            <div />
            {dot}
            <div />
            {dot}
          </div>
        );
      case 6:
      default:
        return (
          <div className="w-full h-full grid grid-cols-2 gap-y-2 p-2 py-1.5 place-items-center">
            {dot}
            {dot}
            {dot}
            {dot}
            {dot}
            {dot}
          </div>
        );
    }
  };

  // If it's the owner's die and player is currentPlayers[0], disable clicks
  const ownerMode = currentPlayers && user && user === currentPlayers[0];

  return ownerMode ? (
    // non-clickable UI when owner condition holds (you had that condition earlier)
    <div
      className={`flex justify-center items-center border-2 rounded-lg w-16 h-16 group ${
        selected ? "bg-blue-200/40" : "bg-neutral-50 hover:cursor-not-allowed hover:bg-red-200/40"
      }`}
      style={{ transform: `scale(${size})` }}
    >
      {renderDice()}
    </div>
  ) : (
    commonWrapper(renderDice(), true)
  );
}