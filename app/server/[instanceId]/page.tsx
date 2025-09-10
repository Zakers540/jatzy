import { redirect } from 'next/navigation'
import Yatsy from "@/components/Yatsy";

type PageProps = {
    params: Promise<{
        instanceId: string
    }>
}

export default async function Server({ params }: PageProps) {
    const { instanceId } = await params

    const maxWaitMs = 4000
    const retryDelayMs = 200
    const apiBase = process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:5328' : 'https://jatzy.vercel.app'
    const start = Date.now()

    while (Date.now() - start < maxWaitMs) {
        const response = await fetch(`${apiBase}/api/tjek/${instanceId}`, { cache: 'no-store' })
        if (response.ok) {
            const data = await response.json()
            if (data?.exists) {
                break
            } else {
                redirect('/server/deltag')
            }
        }

        await new Promise((resolve) => setTimeout(resolve, retryDelayMs))
    }

    return (
        <Yatsy instanceId={instanceId}/>
    )
}