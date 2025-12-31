import { LoginForm } from "@/components/login-form";

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<{ reason?: string }>;
}) {
  const params = await searchParams;
  const reason = typeof params?.reason === "string" ? params.reason : undefined;

  return (
    <div className="mt-20 flex w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm initialReason={reason} />
      </div>
    </div>
  );
}
