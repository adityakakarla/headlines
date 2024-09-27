import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature') as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event: Stripe.Event;

  try {
    if (!sig || !webhookSecret)
      return new Response('Webhook secret not found.', { status: 400 });
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    switch (event.type) {
      case 'checkout.session.completed':
        const data = event.data.object
        const email = data.customer_details?.email
        if (email) {
          const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
          const { data, error } = await supabase.rpc(
            "get_user_id_by_email",
            {
              email,
            }
          );
          const user_id = data[0].id
          await supabase.from('payment').update({ 'has_paid': true }).eq('user_id', user_id)
          return new Response('Success', { status: 200 })
        } else {
          return new Response('Could not find user email', { status: 404 })
        }
      default:
        return new Response('Unhandled event type')
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.log(`❌ Error message: ${err.message}`);
      return new Response(`Webhook Error: ${err.message}`, { status: 400 });
    }
  }
}