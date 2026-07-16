import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "无线电考试刷题",
  description: "业余无线电操作证考试题库练习与模拟考试",
};

// GoatCounter 统计代码（替换 YOUR_CODE 为你的站点代码）
const GOATCOUNTER_CODE = "enigmak";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          data-goatcounter={`https://${GOATCOUNTER_CODE}.goatcounter.com/count`}
          async
          src="//gc.zgo.at/count.js"
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
