import { createClient } from "@/lib/supabase/server";
import { Suspense } from "react";
async function DefaultData() {
  const supabase = await createClient();
  const { data: instruments } = await supabase.from("task").select();
  const title = instruments?.map((instrument) => instrument.title).join(", ");
  //return <pre>{JSON.stringify(instruments, null, 2)}</pre>;
  return <pre>{title}</pre>;
}
export default function Instruments() {
  return (
    <Suspense fallback={<div>Loading instruments...</div>}>
      <DefaultData />
    </Suspense>
  );
}
