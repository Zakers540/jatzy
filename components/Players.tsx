type PlayersProps = {
    currentPlayers: string[] | [""]
}

export default function Players({currentPlayers}: PlayersProps) {
    return (
        <div className="rounded-md border-1 border-black/20 w-40 flex flex-col p-2 bg-white/40 h-56">
            <h2 className="font-semibold text-lg text-black/80 mb-4">Spillere</h2>
            <ul className="w-full overflow-y-auto overflow-x-hidden">
                {currentPlayers.map((currentPlayer, i) => (
                    <li key={i} className="px-1 gap-2 flex items-center justify-between w-full py-1 rounded-md text-md font-medium text-black/80 hover:bg-blue-200/40 border-1 border-transparent hover:border-1 hover:border-blue-500/40 transition-colors cursor-pointer"><span className="whitespace-nowrap text-ellipsis overflow-hidden w-full">{currentPlayer}</span><div className="w-2 h-2 rounded-full bg-blue-500"/></li>
                ))}
            </ul>
        </div>
    )
}