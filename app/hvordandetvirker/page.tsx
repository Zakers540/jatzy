import Aside from "@/components/Aside";

export default function Index() {
    return(
        <main className="min-h-screen w-full pt-24 px-8">
        <Aside digit="01"
               title="Oprettelse af server"
               text="Test test test test test test test test test test test test test test test test test"
        />
        <Aside digit="02"
               position="left"
               title="Oprettelse af server"
               text="Test test test test test test test test test test test test test test test test test"
        />
        </main>
    )
}