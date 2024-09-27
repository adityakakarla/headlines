'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import OpenAI from 'openai'
import createUserPayment from '@/utils/supabase/admin'

interface AuthData {
  email: string;
  password: string;
}

export async function login(data: AuthData) {
  const supabase = createClient()

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    console.log(error)
    if (error.code === 'email_not_confirmed') {
      return { error: "Check your inbox for the confirmation email" }
    }
    return { error: error.message }
  }

  return { success: true }
}

export async function signup(data: AuthData) {
  const supabase = createClient()

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    console.log(error)
    if (error.code === 'over_email_send_rate_limit') {
      return { error: "We're overloaded! Give us a minute." }
    }
    return { error: error.message }
  }

  await createUserPayment(data.email)

  return { success: true }
}


export async function signout() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    redirect('/error')
  }
  redirect('/')
}

export async function resetPassword(formData: FormData) {
  const supabase = createClient()

  const email = formData.get('email') as string

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: 'https://headlines-mu.vercel.app/update-password',
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }

}

export async function updatePassword(newPassword: string) {
  const supabase = createClient()
  const { error } = await supabase.auth.updateUser({
    password: newPassword
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }

}


export async function generateHeadlines(description: string, customHeadlines: string[]): Promise<string[]> {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

  const customHeadlinesPrompt = customHeadlines && customHeadlines.length > 0
    ? `Here are some examples of existing headlines:\n${customHeadlines.join('\n')}\n\n`
    : '';


  const prompt = `${customHeadlinesPrompt}Generate 8 headlines for the following blog post: ${description}. Separate each headline by ### delimiter. Do not include new line characters. Do not number the generated headlines`

  const response = await client.moderations.create({model: 'omni-moderation-latest', input: prompt})

  if (response.results[0].flagged){
    throw new Error('Inappropriate content')
  }

  const chatCompletion = await client.chat.completions.create({
    messages: [{ role: 'user', content: prompt}],
    model: 'gpt-4o-mini',
  });
  const result = chatCompletion.choices[0].message.content
  return result!.split('###')
}
