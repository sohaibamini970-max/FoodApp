"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function CallbackInner() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const accessToken = params.get("accessToken");
    const refreshToken = params.get("refreshToken");

    if (accessToken && refreshToken) {
      localStorage.setItem("foodiehub-access", accessToken);
      localStorage.setItem("foodiehub-refresh", refreshToken);
      // Force reload so AuthProvider re-hydrates from /me
      window.location.href = "/";
    } else {
      router.replace("/login?error=oauth_failed");
    }
  }, [params, router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0a0a0a] text-white">
      <div className="flex flex-col items-center gap-4">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-white/30 border-t-orange-500" />
        <p className="text-sm text-gray-400">Signing you in…</p>
      </div>
    </main>
  );
}

export default function OAuthCallbackPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0a0a]" />}>
      <CallbackInner />
    </Suspense>
  );
}