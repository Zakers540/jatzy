import {Dispatch, SetStateAction} from "react";

type ClickedPlayerProps = {
    clickedPlayerName: string;
    setClickedPlayer: Dispatch<SetStateAction<boolean>>;
}

export default function ClickedPlayer() {
    return (
        <div className="fixed inset-o"></div>
    )
}