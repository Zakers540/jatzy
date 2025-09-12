type DiceProps = {
    diceNumber: number
}

export default function Dice({ diceNumber }: DiceProps) {
    return (
        <div className="flex justify-center items-center border rounded-sm w-16 h-16 bg-neutral-50">
            {(() => {
                switch (diceNumber) {
                    case 1:
                        return (
                            <div className="w-full h-full flex justify-center items-center">
                                <div className="w-3 h-3 bg-black rounded-full" />
                            </div>
                        )
                    case 2:
                        return (
                            <div className="w-full h-full flex justify-between items-center p-2">
                                <div className="w-3 h-3 bg-black rounded-full" />
                                <div className="w-3 h-3 bg-black rounded-full" />
                            </div>
                        )
                    case 3:
                        return (
                            <div className="w-full h-full flex flex-col justify-between p-2">
                                <div className="flex justify-start">
                                    <div className="w-3 h-3 bg-black rounded-full" />
                                </div>
                                <div className="flex justify-center">
                                    <div className="w-3 h-3 bg-black rounded-full" />
                                </div>
                                <div className="flex justify-end">
                                    <div className="w-3 h-3 bg-black rounded-full" />
                                </div>
                            </div>
                        )
                    case 4:
                        return (
                            <div className="w-full h-full grid grid-cols-2 gap-2 p-2 place-items-center">
                                <div className="w-3 h-3 bg-black rounded-full" />
                                <div className="w-3 h-3 bg-black rounded-full" />
                                <div className="w-3 h-3 bg-black rounded-full" />
                                <div className="w-3 h-3 bg-black rounded-full" />
                            </div>
                        )
                    case 5:
                        return (
                            <div className="w-full h-full grid grid-cols-3 grid-rows-3 p-2 place-items-center">
                                <div className="w-3 h-3 bg-black rounded-full" />
                                <div />
                                <div className="w-3 h-3 bg-black rounded-full" />
                                <div />
                                <div className="w-3 h-3 bg-black rounded-full" />
                                <div />
                                <div className="w-3 h-3 bg-black rounded-full" />
                                <div />
                                <div className="w-3 h-3 bg-black rounded-full" />
                            </div>
                        )
                    case 6:
                        return (
                            <div className="w-full h-full grid grid-cols-2 gap-y-2 p-2 py-1.5 place-items-center">
                                <div className="w-3 h-3 bg-black rounded-full" />
                                <div className="w-3 h-3 bg-black rounded-full" />
                                <div className="w-3 h-3 bg-black rounded-full" />
                                <div className="w-3 h-3 bg-black rounded-full" />
                                <div className="w-3 h-3 bg-black rounded-full" />
                                <div className="w-3 h-3 bg-black rounded-full" />
                            </div>
                        )
                }
            })()}
        </div>
    )
}