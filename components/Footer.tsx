export default function Footer () {
    return (
        <footer className="flex justify-center mt-8 bg-green-50/20">
            <div className="grid grid-cols-1 md:grid-cols-[2fr_3fr] w-full px-4 md:px-16 py-4 pb-8 md:pb-4">
                <div className="flex flex-col justify-center md:block">
                    <p className="italic text-3xl font-semibold">yatzy</p>
                    <div className="flex flex-col items-center md:ml-4 md:block">
                        <div className="mt-6 flex flex-col items-center justify-center md:justify-start md:items-start space-y-4 font-extralight">
                            <p>© 2025 yatsy</p>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-center md:items-start md:flex-row text-neutral-700 md:space-x-24">
                    <div className="flex flex-col space-y-4 mt-16 md:mt-0 justify-center items-center md:items-start md:justify-start">
                        <p className="cursor-default text-lg font-semibold text-center md:text-start">Server</p>
                        <div className="flex flex-col justify-center md:justify-start space-y-4 leading-4 text-neutral-500 w-32">
                            <a className="hover:text-neutral-800 cursor-pointer text-center md:text-start" href="/booking/bordresevationer">Opret en server</a>
                            <a className="hover:text-neutral-800 cursor-pointer text-center md:text-start" href="/booking/billetsalg">Deltag i server</a>
                        </div>
                    </div>
                    <div className="flex flex-col space-y-4 mt-8 md:mt-0 justify-center md:justify-start">
                        <a className="cursor-pointer hover:text-neutral-900 text-lg font-semibold text-center md:text-start" href="/kontakt">Yatsy regler</a>
                    </div>
                    <div className="flex flex-col space-y-4 mt-8 md:mt-0 justify-center md:justify-start">
                        <a className="cursor-pointer hover:text-neutral-900 text-lg font-semibold text-center md:text-start" href="/kontakt">Hvordan det virker</a>
                    </div>
                </div>
            </div>
        </footer>
    )
}