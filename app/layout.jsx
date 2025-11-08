import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AntdRegistry } from '@ant-design/nextjs-registry';
import HeaderApp from '@/components/HeaderApp';
import FooterApp from '@/components/FooterApp';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "NFT 检测系统",
  description: "基于AI的NFT检测工具",
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AntdRegistry>
          <div className="flex flex-col min-h-screen">
            <HeaderApp />
            <main className="flex-1 flex flex-col">
              {children}
            </main>
            <FooterApp />
          </div>
        </AntdRegistry>
      </body>
    </html>
  );
}
