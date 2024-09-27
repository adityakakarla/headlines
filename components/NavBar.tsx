import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { signout } from "@/app/actions";

export default async function Navbar() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    return (
        <div className="w-full h-16 border-b border-black flex flex-row items-center justify-between px-8">
            <Link href="/"><b>headlines.wtf</b></Link>
            <div className="flex flex-row space-x-4 items-center">
                {user ? (
                    <>
                        <Link className="ml-4" href="/generate">Generate</Link>
                        <form action={signout}>
                            <button type="submit" className="ml-4">Sign Out</button>
                        </form>
                    </>
                ) : (
                    <>
                        <Link className="ml-4" href="/login">Login</Link>
                    </>
                )}
            </div>
        </div>
    );
}
