"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [resetEmail, setResetEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);
    setResetEmail(null);

    const siteUrl =
      typeof window !== "undefined"
        ? window.location.origin
        : process.env.NEXT_PUBLIC_SITE_URL?.trim() || "";

    if (!siteUrl) {
      setError(
        "사이트 URL을 확인할 수 없습니다. NEXT_PUBLIC_SITE_URL 환경변수를 설정해 주세요."
      );
      setIsLoading(false);
      return;
    }

    if (password !== repeatPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${siteUrl}/auth/confirm?next=/`,
        },
      });
      if (error) {
        // 이미 가입된 이메일이면(소프트 딜리트 복구 포함) 로그인으로 전환 시도
        const alreadyRegistered =
          /already\s*registered|user\s*already\s*registered|already\s*exists/i.test(
            error.message
          );

        if (alreadyRegistered) {
          const { error: signInError } = await supabase.auth.signInWithPassword(
            {
              email,
              password,
            }
          );

          if (signInError) {
            setResetEmail(email);
            throw new Error("이미 가입된 이메일입니다. 비밀번호를 재설정해 주세요.");
          }

          try {
            await fetch("/auth/reactivate", { method: "POST" });
          } catch {
            // ignore
          }

          router.replace("/");
          router.refresh();
          return;
        }

        throw error;
      }

      router.push("/auth/sign-up-success");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">회원가입</CardTitle>
          <CardDescription>새 계정을 만드세요.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">이메일</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">비밀번호</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="repeat-password">비밀번호 확인</Label>
                </div>
                <Input
                  id="repeat-password"
                  type="password"
                  required
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              {resetEmail ? (
                <p className="text-sm">
                  <Link
                    href={`/auth/forgot-password?email=${encodeURIComponent(resetEmail)}`}
                    className="underline underline-offset-4"
                  >
                    비밀번호 재설정으로 이동
                  </Link>
                </p>
              ) : null}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "계정 생성 중..." : "회원가입"}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              이미 계정이 있나요?{" "}
              <Link href="/auth/login" className="underline underline-offset-4">
                로그인
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
