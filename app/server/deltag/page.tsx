export default function Server() {
    return (
        <main className="min-h-screen w-full pt-8 flex items-center justify-center">
            <form className="max-w-md w-full bg-white/20 backdrop-blur-lg border-3 border-black/80 rounded-2xl p-8 flex flex-col gap-6 shadow-md">
                <h1 className="text-2xl font-semibold text-black/80 mb-4">Deltag i en server</h1>

                <div className="flex flex-col">
                    <label htmlFor="instanceId" className="text-black/60 mb-2">Hvad er server ID'et?</label>
                    <input
                        type="number"
                        placeholder="123456"
                        className="input"
                    />
                </div>

                <div className="flex flex-col">
                    <label htmlFor="name" className="text-black/60 mb-2">Hvad ville du blive kaldt?</label>
                    <input
                        type="text"
                        placeholder="Poul"
                        className="input"
                    />
                </div>

                <button
                    type="submit"
                    className="p-2 border-2 border-blue-500 rounded-2xl text-xl mt-8 text-black/80
            font-semibold shadow-sm hover:shadow-md hover:bg-blue-500 hover:text-blue-50"
                >
                    Deltag
                </button>
            </form>
        </main>
    )
}
