import Image from "next/image";
import { auth0 } from "@/lib/auth0";
import { LoginButton, LogoutButton } from "@/components/atoms";
import { Profile } from "@/components/molecules";
import { ChatApp } from "@/components/organisms";
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
    <main className="h-[100dvh] w-full flex flex-col items-center p-2 sm:p-4 gap-3 bg-slate-100 overflow-hidden">
      {/* Account Info Header Bar */}
      <div className="w-full max-w-[1000px] bg-white rounded-2xl shadow-sm border border-slate-200/80 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <Image
            src={LogoWithOutBG}
            alt="Logo"
            width={38}
            height={38}
            className="shrink-0"
            priority
          />
          <div>
            <h1 className="text-[17px] font-bold text-gray-900 tracking-tight">
              Your account
            </h1>
            <div className="w-full h-px bg-gray-100 my-1" />
            <div className="flex items-center gap-2">
              <Profile />
            </div>
          </div>
        </div>
        <div>
          <LogoutButton className="inline-block px-5 py-2 bg-[#f0f0f0] hover:bg-gray-200 text-gray-600 font-medium rounded-full text-[13px] transition-colors" />
        </div>
      </div>

      {/* ChatApp covering 100% of remaining height & width */}
      <div className="w-full max-w-[1000px] flex-1 min-h-0 flex flex-col">
        <ChatApp />
      </div>
    </main>
  );
}
