"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (loading || !mounted) return;
    if (!user) router.replace("/login");
    else if (user.role !== "admin") router.replace("/");
  }, [user, loading, mounted, router]);

  // Show overlay while checking — but children are STILL rendered underneath
  const checking = !mounted || loading || !user || user.role !== "admin";

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-white">
      <AdminSidebar />
      <main className="flex-1 overflow-x-hidden pt-20 lg:pt-0">
        {children}
      </main>

      {/* Overlay while checking access — children stay in the tree */}
      {checking && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-[#0a0a0a]">
          <div className="text-center">
            <div className="text-5xl">🔒</div>
            <div className="mt-4 text-lg font-bold">Checking access...</div>
          </div>
        </div>
      )}
    </div>
  );
}