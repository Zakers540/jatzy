type AsideProps = {
    position?: "left" | "right",
    digit: string,
    title: string,
    text: string
}

export default function Aside({position, digit, title, text}: AsideProps) {
    return (
        <aside className="grid-cols-2 mb-16">
            {position === "right" && (
                <div className="flex flex-col w-full"></div>
            )}
            <div className={`flex flex-col ${position === "left" ? "items-end" : "items-start"}`}>
                <div>
                <h2 className="font-mono font-semibold text-6xl text-black/80 mb-6 p-1 bg-white/80 rounded-md">{digit}</h2>
                </div>
                <div className="bg-white/40 p-2 rounded-md">
                    <h3 className="text-4xl tracking-tighter font-medium mb-4">{title}</h3>
                    <p className={`text-xl ${position === "left" ? "w-160" : "w-160"}` }>{text}</p>
                </div>
            </div>
        </aside>
    )
}