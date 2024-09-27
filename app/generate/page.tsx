'use client'

import DescriptionForm from "@/components/DescriptionForm";
import Headlines from "@/components/Headlines";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LoadingSpinner } from "@/components/ui/spinner";

export default function Generate() {
  const [headlines, setHeadlines] = useState<string[]>([]);
  const [verified, setVerified] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        router.push('/login');
      } else {
        const {data, error} = await supabase.from('payment').select('has_paid')
        
        if(error || !data){
          router.push('/error')
        }

        const has_paid = data![0].has_paid;

        if(!has_paid){
          router.push('/payment')
        } else {
          setVerified(true)
        }
      }
    };

    fetchUser();
  }, [router]);

  if (!verified) return (
    <div className="flex flex-col items-center pt-64">
      <LoadingSpinner />
    </div>
  )

  return (
    <div className="flex flex-col items-center pt-64">
      {headlines.length ?
        <Headlines headlines={headlines} setHeadlines={setHeadlines} /> :
        <>
          <DescriptionForm setHeadlines={setHeadlines} />
        </>}
    </div>
  );
}
