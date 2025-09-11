export default function Server() {
    return (
        <main className="min-h-screen w-full flex items-center justify-center">
            <form className="max-w-md w-full flex flex-col gap-6 -mt-8">
                <h1 className="text-4xl font-semibold text-black/80 mb-4">Deltag i en server</h1>

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
