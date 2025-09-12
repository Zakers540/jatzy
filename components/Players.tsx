type PlayersProps = {
    currentPlayers: string[] | [""]
}

export default function Players({currentPlayers}: PlayersProps) {
    return (
        <tr>
            <td colSpan={currentPlayers.length + 1} className="h-[1px] bg-black/80 p-0" />
        </tr>
    )
}