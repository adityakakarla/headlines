'use client'

import { createClient } from "@/utils/supabase/client"
import { useEffect } from "react"
import { LoadingSpinner } from "@/components/ui/spinner"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function Payment() {
    const paymentLink = 'https://buy.stripe.com/4gw5kx2Xs1X85s49AA'
    const router = useRouter()
    const [verified, setVerified] = useState(false);
    const [loading, setLoading] = useState(true)
    const [email, setEmail] = useState('')

    useEffect(() => {
        const fetchUser = async () => {
            const supabase = createClient();
            const { data, error } = await supabase.auth.getUser();
            if (error || !data.user) {
                router.push('/login');
            } else if (!data.user.email) {
                router.push('/error')
            }
            else {
                setEmail(data.user.email)

                const has_paid_result = await supabase.from('payment').select('has_paid')

                if (error || !data) {
                    router.push('/error')
                }

                const has_paid = has_paid_result.data![0].has_paid

                if (has_paid) {
                    router.push('/generate')
                } else {
                    setVerified(true)
                    setEmail(data.user.email)
                    setLoading(false)
                }
            }
        };

        fetchUser();
    }, [router]);

    if (loading || !verified) return (
        <div className="flex flex-col items-center pt-64">
            <LoadingSpinner />
        </div>
    )


    return (
        <div className="flex flex-col items-center space-y-8">
            <h1 className="mt-64 text-2xl">Unlimited lifetime access for $20</h1>
            <Button asChild><a href={`${paymentLink}?prefilled_email=${email}`} target="_blank" rel="noopener noreferrer">Become a top-tier writer</a></Button>
        </div>)
}