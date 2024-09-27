'use client'

import { resetPassword } from "../actions"  // Assumes you have a reset password action
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { useState } from "react"
import { LoadingSpinner } from "@/components/ui/spinner"

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email" }),
})

export default function ResetPassword() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  })

  async function handleReset(data: z.infer<typeof formSchema>) {
    setLoading(true)
    const response = await resetPassword(new FormData(document.querySelector("form")!))

    if (response.error) {
      form.setError("email", { message: response.error })
      setLoading(false)
    } else {
      setSuccess(true)
      setLoading(false)
    }
  }

  if (loading) return (
    <div className="flex flex-col items-center pt-64">
      <LoadingSpinner />
    </div>
  )

  return (
    <div className="flex flex-col items-center">
      {success ? (
        <h1 className="mt-64 text-2xl">Check your email for reset instructions.</h1>
      ) : (
        <Form {...form}>
          <form className="mt-64 border-black text-black flex flex-col w-96 space-y-4 bg-white p-4 rounded-2xl" onSubmit={form.handleSubmit(handleReset)}>
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
            <Button type="submit" className="w-full">Send Reset Link</Button>
          </form>
        </Form>
      )}
    </div>
  )
}
