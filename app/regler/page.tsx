//TODO: evt tilføj tips som at tilføje sociale regler

const regler = [
    {
        regel: "Spillet bliver spillet med 5 terninger."
    },
    {
        regel: "Hver gruppe får 3 kast pr tur."
    },
    {
        regel: "Man må maks bruge en kombination en gang som gruppe (f.eks tre ens, firere)."
    },
    {
        regel: "Når alle spiller har udfyldt deres yatzysheet vinder spilleren med flest point."
    },
    {
        regel: "Hvis der er flere end 1 i en gruppe skal alle i gruppen være enige om valget."
    },
    {
        regel: "Man får bonuspoint hvis man har flere end 63 point i den første sektion."
    }
]

export default function Page() {
    return (
        <main className="min-h-screen w-full flex flex-col items-center pt-24 md:pt-16">
            <div className="max-w-3xl p-4 w-full">
                <h1 className="text-center text-black/80 text-4xl font-semibold rounded-md p-2 mb-12">
                    Regler for Yatzy (gruppespil)
                </h1>

                <div className="space-y-8">
                    {regler.map((regel, index) => (
                        <div key={index} className="flex flex-row items-center text-black/80">
                            <span className="font-mono text-2xl mr-4 bg-blue-50 border border-blue-200 text-blue-800 rounded-md px-3 py-1 shadow-sm">
                                {index+1}
                            </span>
                            <p className="text-lg text-black/80 bg-white/80 rounded-md p-2">
                                {regel.regel}
                            </p>
                        </div>))}
                </div>
            </div>
        </main>
    )
}
