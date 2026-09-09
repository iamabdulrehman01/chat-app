import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Users, MessageCircle, Sparkles } from "lucide-react";
import { auth0 } from "@/lib/auth0";
import { LogoutButton } from "@/components/atoms";
import { Profile } from "@/components/molecules";
import LogoWithOutBG from "@/../public/LogoWithOutBG.png";

export const metadata = {
  title: "Solo Chat | Let's We Connect",
  description: "One-on-one direct messaging (Coming Soon)",
};

export default async function SoloChatPage() {
  const session = await auth0.getSession();
  const user = session?.user;

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <main className="h-[100dvh] w-full flex flex-col items-center p-2 sm:p-4 gap-3 bg-slate-100 overflow-hidden">
      {/* Top Header Bar with Home Back Link, Title, Group Chat Link & Red Logout */}
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
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-600 border border-amber-100">
                Coming Soon
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

      {/* Centered Coming Soon View covering 100% of remaining height & width */}
      <div className="w-full max-w-[1000px] flex-1 min-h-0 flex flex-col">
        <div className="w-full h-full flex-1 bg-white rounded-none sm:rounded-2xl shadow-none sm:shadow-chat border-0 sm:border sm:border-slate-200/80 flex flex-col items-center justify-center p-6 text-center animate-messageIn">
          <div className="relative mb-5">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-purple-500/10 border border-blue-200/60 shadow-inner">
              <MessageCircle className="h-10 w-10 text-blue-600" />
            </div>
            <div className="absolute -top-1.5 -right-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-amber-400 text-white shadow-md shadow-amber-400/30">
              <Sparkles className="h-4 w-4" />
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-xs font-semibold mb-3">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
            Feature in Progress
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Solo Chat Coming Soon
          </h2>

          <p className="text-sm text-slate-500 max-w-md mt-2 leading-relaxed">
            One-on-one direct messaging is currently under active development. You will soon be able to chat privately with individual members!
          </p>

          <div className="mt-6 flex items-center gap-3">
            <Link
              href="/group-chat"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-xs sm:text-sm font-semibold rounded-full shadow-md shadow-blue-500/25 transition-all hover:scale-105 active:scale-95"
            >
              <Users className="w-4 h-4" />
              <span>Go to Group Chat</span>
            </Link>

            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold rounded-full transition-colors"
            >
              <span>Back to Menu</span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
