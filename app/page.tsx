export default function Home() {
  return (
      <main className="min-h-screen w-full flex flex-col pt-40 items-center">
        <h1 className="text-black/80 text-4xl font-semibold bg-white/80 rounded-md p-2">Har du også lyst til yatzy?</h1>
        <p className="mt-2 text-md text-neutral-500 bg-white/60 rounded-md p-1">Det har du selvfølgelig!</p>
        <a href="/api/opret" className="p-4 border-2 border-blue-500 rounded-2xl text-xl mt-8 text-black/80 font-semibold shadow-sm hover:shadow-md hover:bg-blue-500 hover:text-blue-50">Start et spil yatzy</a>
      </main>
  )
}
