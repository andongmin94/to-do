import { redirect } from "next/navigation";

export default function Page() {
  redirect("/auth/login");
  return (
    <div className="flex mt-20 w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        {/* <SignUpForm /> */}
      </div>
    </div>
  );
}
