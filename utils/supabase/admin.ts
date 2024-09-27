'use server'

import { createClient } from "@supabase/supabase-js";
import 'dotenv/config'

export default async function createUserPayment(email: string) {
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

    const { data, error } = await supabase.rpc(
        "get_user_id_by_email",
        {
            email,
        }
    );
    const user_id = data[0].id
    await supabase.from('payment').upsert({ 'user_id': user_id, 'has_paid': false})
}