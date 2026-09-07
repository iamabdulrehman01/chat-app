import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "Live Chat App",
  description: "Real-time chat application built with Next.js, Tailwind CSS, shadcn/ui, Zustand, and Socket.io",
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-[100dvh] flex items-center justify-center bg-slate-100 sm:p-4 font-sans antialiased text-slate-900">
        {children}
      </body>
    </html>
  );
}
