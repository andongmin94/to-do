import { ForgotPasswordForm } from "@/components/forgot-password-form";

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<{ email?: string }>;
}) {
  const params = await searchParams;
  const initialEmail = typeof params?.email === "string" ? params.email : undefined;

  return (
    <div className="mt-20 flex w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <ForgotPasswordForm initialEmail={initialEmail} />
      </div>
    </div>
  );
}
