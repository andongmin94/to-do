"use client";

import * as React from "react";

type MaskedEmailProps = {
  email: string;
};

export function MaskedEmail({ email }: MaskedEmailProps) {
  const [revealed, setRevealed] = React.useState(false);

  return (
    <button
      type="button"
      onClick={() => setRevealed((v) => !v)}
      className="inline-flex items-center text-left"
      aria-label={revealed ? "이메일 숨기기" : "이메일 보기"}
      aria-pressed={revealed}
      title={
        revealed ? "클릭하면 이메일을 숨깁니다" : "클릭하면 이메일을 표시합니다"
      }
    >
      <span className={revealed ? "" : "blur-sm select-none"}>{email}</span>
    </button>
  );
}
