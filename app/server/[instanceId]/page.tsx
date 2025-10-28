//TODO: hvis server ikke findes så skriv at den ikke findes længere men hvis spillet er slutter for nyligt kan de prøve at gå ind på dens resultat side eller starte et nyt spil eller de har tastet forkert

import { redirect } from 'next/navigation'
import Yatsy from "@/components/Yatsy";

type PageProps = {
    params: Promise<{
        instanceId: string
    }>
}

export default async function Server({ params }: PageProps) {
    //finder instanceId som ligger i urlet [] er params.
    const { instanceId } = await params

    const apiBase = process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:5328' : 'https://jatzy.vercel.app'
    
    try {
        const response = await fetch(`${apiBase}/api/tjek/${instanceId}`, { 
            cache: 'no-store',
            next: { revalidate: 0 }
        })
        
        if (response.ok) {
            const data = await response.json()
            if (data?.exists) {
                return (
                    <Yatsy instanceId={instanceId} playerName=''/>
                )
            }
        }
        
        // If instance doesn't exist or API call failed, redirect to join page
        redirect('/server/deltag')
    } catch (error) {
        console.error('Error checking instance:', error)
        // On error, redirect to join page
        redirect('/server/deltag')
    }
}