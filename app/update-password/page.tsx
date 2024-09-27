'use client'

import { updatePassword } from "../actions"  // Assumes you have an update password action
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { useState, useEffect } from "react"
import { LoadingSpinner } from "@/components/ui/spinner"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"

const formSchema = z.object({
  newPassword: z.string().min(8, { message: "Password must be at least 8 characters" }),
  confirmPassword: z.string().min(8, { message: "Password must be at least 8 characters" }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export default function UpdatePassword() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [verified, setVerified] = useState(false)
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  })

  async function handleUpdate(data: z.infer<typeof formSchema>) {
    setLoading(true)
    const response = await updatePassword(data.newPassword)
    if (response.error) {
      form.setError("newPassword", { message: response.error })
      setLoading(false)
    } else {
      setSuccess(true)
      setLoading(false)
    }
  }

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const { data, error } = await supabase.auth.getUser();
      if(error || !data.user) {
        router.push('/login');
      } else {
        setVerified(true);
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
    <div className="flex flex-col items-center">
      {success ? (
        <h1 className="mt-64 text-2xl">Password updated successfully.</h1>
      ) : (
        <Form {...form}>
          <form className="mt-64 border-black text-black flex flex-col w-96 space-y-4 bg-white p-4 rounded-2xl" onSubmit={form.handleSubmit(handleUpdate)}>
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password:</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" placeholder="Enter your new password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password:</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" placeholder="Confirm your new password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">Update Password</Button>
          </form>
        </Form>
      )}
    </div>
  )
}