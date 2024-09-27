'use client'

import { login, signup } from "../actions"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { LoadingSpinner } from "@/components/ui/spinner"
import Link from "next/link"
import createUserPayment from "@/utils/supabase/admin"

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email" }),
  password: z.string().min(8, {message: "Password must be at least 8 characters"}),
})

export default function LoginPage() {
  const [signedUp, setSignedUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function handleLogin(data: z.infer<typeof formSchema>) {
    setLoading(true)
    const response = await login(data)

    if (response.error) {
      form.setError("password", { message: response.error })
      setLoading(false)
    } else {
      router.push("/generate")
    }
  }


  async function handleSignup(data: z.infer<typeof formSchema>) {
    setLoading(true)
    const response = await signup(data)

    if (response.error) {
      form.setError("password", { message: response.error })
    } else {
      setSignedUp(true)
    }

    await createUserPayment(data.email)

    setLoading(false)
  }

  if(loading) return (
    <div className="flex flex-col items-center pt-64">
      <LoadingSpinner/>
    </div>
  )

  return (
    <div className="flex flex-col items-center">
      {signedUp ? <h1 className="mt-64 text-2xl">Please check your email for the confirmation link.</h1> : <Form {...form}>
        <form className="mt-64 border-black text-black flex flex-col w-96 space-y-4 bg-white p-4 rounded-2xl">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email:</FormLabel>
                <FormControl>
                  <Input {...field} type="email" placeholder="Enter your email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password:</FormLabel>
                <FormControl>
                  <Input {...field} type="password" placeholder="Enter your password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-row justify-between space-x-4">
            <Button onClick={form.handleSubmit(handleLogin)} className="w-full">Log in</Button>
            <Button variant="secondary" onClick={form.handleSubmit(handleSignup)} className="w-full">Sign up</Button>
          </div>

          <Button variant='link' asChild><Link href='/reset-password'>Reset Password</Link></Button>
        </form>
      </Form>
}
    </div>
  )
}
