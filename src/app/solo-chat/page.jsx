import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Users } from "lucide-react";
import { auth0 } from "@/lib/auth0";
import { LogoutButton } from "@/components/atoms";
import { Profile } from "@/components/molecules";
import { SoloChatApp } from "@/components/organisms";
import LogoWithOutBG from "@/../public/LogoWithOutBG.png";

export const metadata = {
  title: "Solo Chat | Let's We Connect",
  description: "One-on-one direct peer-to-peer messaging",
};

export default async function SoloChatPage() {
  const session = await auth0.getSession();
  const user = session?.user;

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <main className="h-[100dvh] w-full flex flex-col items-center p-2 sm:p-4 gap-3 bg-slate-100 overflow-hidden">
      {/* Top Header Bar with Home Back Link, Title, Group Chat Link & Logout */}
      <div className="w-full max-w-[1000px] bg-white rounded-2xl shadow-sm border border-slate-200/80 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            aria-label="Back to home"
            title="Back to home"
            className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <Image
            src={LogoWithOutBG}
            alt="Logo"
            width={34}
            height={34}
            className="shrink-0"
            priority
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-gray-900 tracking-tight leading-none">
                Solo Chat
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100">
                Active
              </span>
            </div>
            <div className="mt-1 flex items-center gap-2">
              <Profile compact={true} />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/group-chat"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-xs font-semibold rounded-full shadow-sm shadow-blue-500/20 transition-all"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Group Chat</span>
          </Link>
          <LogoutButton variant="compact" />
        </div>
      </div>

      {/* SoloChatApp covering 100% of remaining height & width */}
      <div className="w-full max-w-[1000px] flex-1 min-h-0 flex flex-col">
        <SoloChatApp sessionUser={user} />
      </div>
    </main>
  );
}
