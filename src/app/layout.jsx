import { Inter } from "next/font/google";
import "./globals.css";
import { Auth0Provider } from "@auth0/nextjs-auth0/client";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "Let's We Connect",
  description: "Real-time chat application built with Next.js, Tailwind CSS, shadcn/ui, Zustand, and Socket.io",
  icons: {
    icon: "/favicon.png",
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
      <body className="h-[100dvh] w-full m-0 p-0 bg-slate-100 font-sans antialiased text-slate-900 overflow-x-hidden">
        <Auth0Provider>{children}</Auth0Provider>
      </body>
    </html>
  );
}
