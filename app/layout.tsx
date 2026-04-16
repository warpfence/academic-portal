import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ADDS - Alpha generation Digital Daily Survey",
  description: "뉴노멀 시대를 위한 혁신, 알파 세대 디지털 일상 종단 ADDS 데이터",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
