import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
    title: 'Yatzy',
    description: 'Gratis multiplayer yatzy.',
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <>
        <Navbar />
        {children}
        <Footer />
        </>
    )
}
