import Image from "next/image";
import Link from "next/link";
import { Users, User } from "lucide-react";
import { auth0 } from "@/lib/auth0";
import { LoginButton, LogoutButton } from "@/components/atoms";
import { Profile } from "@/components/molecules";
import LogoWithOutBG from "@/../public/LogoWithOutBG.png";

export default async function Home() {
  const session = await auth0.getSession();
  const user = session?.user;

  if (!user) {
    return (
      <main className="min-h-screen h-[100dvh] w-full flex flex-col items-center justify-center p-4 bg-slate-100">
        <div className="bg-white rounded-[28px] shadow-[0_4px_32px_rgba(0,0,0,0.08)] py-8 px-10 sm:py-12 sm:px-12 flex flex-col items-center gap-4 w-full max-w-[360px]">
          <Image
            src={LogoWithOutBG}
            alt="Logo"
            width={68}
            height={68}
            priority
          />
          <h1 className="text-[17px] font-bold text-gray-900 tracking-tight text-center">
            Welcome to Let's We Connect
          </h1>
          <p className="text-[13px] text-gray-400 text-center leading-relaxed -mt-2">
            Get started by logging in to your account
          </p>
          <div className="h-2" />
          <LoginButton />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen h-[100dvh] w-full flex flex-col items-center justify-center p-4 bg-slate-100">
      <div className="bg-white rounded-[28px] shadow-[0_4px_32px_rgba(0,0,0,0.08)] py-8 px-8 sm:py-10 sm:px-10 flex flex-col items-center gap-4 w-full max-w-[380px] animate-messageIn">
        <Image
          src={LogoWithOutBG}
          alt="Logo"
          width={60}
          height={60}
          priority
        />

        <h1 className="text-[17px] font-bold text-gray-900 tracking-tight">
          Your account
        </h1>
        <div className="w-full h-px bg-gray-100" />

        <Profile />

        <div className="w-full h-px bg-gray-100 my-1" />

        {/* 2 Main Action Buttons: Group Chat & Solo Chat */}
        <div className="w-full flex flex-col gap-2.5">
          <Link
            href="/group-chat"
            className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-full text-[14px] shadow-md shadow-blue-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Users className="w-4 h-4" />
            <span>Group Chat</span>
          </Link>

          <Link
            href="/solo-chat"
            className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-full text-[14px] shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <User className="w-4 h-4" />
            <span>Solo Chat</span>
          </Link>
        </div>

        <div className="w-full pt-1">
          <LogoutButton />
        </div>
      </div>
    </main>
  );
}
