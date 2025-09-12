import Aside from "@/components/Aside";

export default function Index() {
    return(
        <main className="min-h-screen w-full pt-24 px-40">
            <Aside
                digit="01"
                title="Opret eller deltag"
                text="Start et nyt spil og del linket med vennerne – eller deltag i et eksisterende spil som blev lavet indenfor 7 dage via et delt link."
            />
            <Aside
                position="left"
                digit="02"
                title="Spillet gemmes"
                text="Dit spil bliver gemt i en uge på linket oprettet til dig og dine venner."
            />
            <Aside
                digit="03"
                title="Din tur og kast"
                text="Når det er din tur, kaster du 5 terninger. Du har op til tre kast pr. tur."
            />
            <Aside
                position="left"
                digit="04"
                title="Kast terninger"
                text="Efter hvert kast kan du klikke på de terninger, du ville kaste igen, og beholde de andre."
            />
            <Aside
                digit="05"
                title="Vælg felt på blokken"
                text="Vælg et ledigt felt på Yatzy-blokken, der passer til din kombination (fx 1’ere, par, lille straight, osv.)."
            />
            <Aside
                position="left"
                digit="06"
                title="Point og næste spiller"
                text="Point beregnes automatisk. Når du har valgt et felt, går turen videre til næste spiller."
            />
            <Aside
                digit="07"
                title="Spil slut og vinder"
                text="Når alle felter er udfyldt hos alle spillere, summeres point, og vinderen vises i resultatsiden."
            />
            <Aside
                position="left"
                digit="08"
                title="Resultater gemmes"
                text="Dine resultater blive gemt i en måned på linket oprettet til dig og dine venner."
            />
        </main>
    )
}