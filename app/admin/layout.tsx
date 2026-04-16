"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

interface Admin {
  id: number;
  username: string;
  name: string;
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [checking, setChecking] = useState(true);

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) {
      setChecking(false);
      return;
    }

    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth");
        if (res.ok) {
          const data = await res.json();
          setAdmin(data.admin);
        } else {
          router.replace("/admin/login");
        }
      } catch {
        router.replace("/admin/login");
      } finally {
        setChecking(false);
      }
    };

    checkAuth();
  }, [isLoginPage, router]);

  const handleLogout = async () => {
    await fetch("/api/auth", { method: "DELETE" });
    router.replace("/admin/login");
  };

  // 로그인 페이지는 가드 없이 바로 렌더링
  if (isLoginPage) {
    return <>{children}</>;
  }

  // 인증 확인 중
  if (checking) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <p className="text-[#6d6d6d]">인증 확인 중...</p>
      </div>
    );
  }

  // 인증 완료 — 로그아웃 바 + 콘텐츠
  return (
    <>
      {admin && (
        <div className="bg-[#171719] text-white text-sm px-6 py-2 flex items-center justify-between">
          <span>
            관리자 모드 — <strong>{admin.name}</strong> ({admin.username})
          </span>
          <button
            onClick={handleLogout}
            className="text-[#e0e0e0] hover:text-white transition-colors"
          >
            로그아웃
          </button>
        </div>
      )}
      {children}
    </>
  );
}
