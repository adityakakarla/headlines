import { Button } from "@/components/ui/button";
import Link from "next/link";
import Steps from "@/components/Steps";

export default function Home() {
    return (
      <div className="flex flex-col items-center text-center p-4">
        <h1 className="text-6xl font-bold mb-8 mt-40">The AI writing tool that actually works</h1>
        <h3 className="text-3xl mt-6 mb-12">an AI-powered headline generator built by a writer</h3>
        <Steps/>
        <Button asChild className="mt-8"><Link href="/generate">Get Started</Link></Button>
      </div>
    );
  }