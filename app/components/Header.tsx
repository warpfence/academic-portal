"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface HeaderProps {
  variant?: "transparent" | "solid";
}

export default function Header({ variant = "transparent" }: HeaderProps) {
  const pathname = usePathname();
  const isTransparent = variant === "transparent";

  const menuItems = [
    { label: "학과 소개", href: "/about" },
    { label: "발간물", href: "/publications" },
    { label: "소식/공지사항", href: "/notices" },
    { label: "자료실", href: "/resources" },
  ];

  return (
    <nav
      className={`${
        isTransparent
          ? "absolute top-[4px] left-0 right-0 z-20"
          : "sticky top-0 z-50 bg-white border-b border-[#f0f0f0]"
      } h-[56px]`}
    >
      <div
        className={`flex items-center justify-between h-full ${
          isTransparent ? "px-10" : "max-w-[1280px] mx-auto px-10"
        }`}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/logo-footer.png"
            alt="ADDS 로고"
            width={36}
            height={36}
            className={isTransparent ? "brightness-0 invert" : ""}
          />
          <span
            className={`font-bold text-lg tracking-tight ${
              isTransparent ? "text-white" : "text-[#171719]"
            }`}
          >
            ADDS
          </span>
        </Link>

        {/* Menu */}
        <div className="flex items-center gap-20">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`font-bold text-base leading-6 tracking-[-0.368px] transition-colors ${
                  isTransparent
                    ? "text-white hover:text-white/80"
                    : isActive
                    ? "text-[#72bf44]"
                    : "text-[#171719] hover:text-[#72bf44]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Language */}
        <div className="flex items-center gap-2.5">
          <span
            className={`font-bold text-base leading-6 tracking-[-0.368px] ${
              isTransparent ? "text-white" : "text-[#171719]"
            }`}
          >
            KOR
          </span>
          <span className={isTransparent ? "text-white/40" : "text-[#bdbdbd]"}>
            |
          </span>
          <span
            className={`font-medium text-base leading-6 tracking-[-0.368px] ${
              isTransparent ? "text-[#e0e0e0]" : "text-[#6d6d6d]"
            }`}
          >
            ENG
          </span>
        </div>
      </div>
    </nav>
  );
}
