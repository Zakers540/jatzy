interface CardProps {
    title: string;
    description: string;
}

export default function Card({ title, description }: CardProps) {
    return (
        <div className="group cursor-default p-5 flex flex-col w-64 h-44 rounded-2xl border-2 border-black/20 bg-white/20 shadow-md transition-all duration-300 ease-in-out hover:shadow-xl hover:border-black/80 hover:bg-gradient-to-tr hover:from-blue-100/80 hover:to-green-100/80">
            <div className="w-full flex justify-end opacity-0 group-hover:opacity-100 transition-all duration-200 transform group-hover:-translate-y-1 group-hover:translate-x-1">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-black/70 group-hover:text-black">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15M19.5 4.5H8.25M19.5 4.5v11.25" />
                </svg>
            </div>
            <h2 className="text-2xl text-center font-semibold leading-tight text-black transition-colors duration-300 ">
                {title}
            </h2>
            <p className="mt-2 text-center text-black/70 text-sm">
                {description}
            </p>
        </div>
    );
}
