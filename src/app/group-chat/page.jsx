import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, User } from "lucide-react";
import { auth0 } from "@/lib/auth0";
import { LogoutButton } from "@/components/atoms";
import { Profile } from "@/components/molecules";
import { ChatApp } from "@/components/organisms";
import LogoWithOutBG from "@/../public/LogoWithOutBG.png";

export const metadata = {
  title: "Group Chat | Let's We Connect",
  description: "Real-time group chat room",
};

export default async function GroupChatPage() {
  const session = await auth0.getSession();
  const user = session?.user;

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <main className="h-[100dvh] w-full flex flex-col items-center p-2 sm:p-4 gap-3 bg-slate-100 overflow-hidden">
      {/* Top Header Bar with Home Back Link, Title, Solo Chat Link & Red Logout */}
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
                Group Chat
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-600 border border-blue-100">
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
            href="/solo-chat"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-full transition-colors"
          >
            <User className="w-3.5 h-3.5" />
            <span>Solo Chat</span>
          </Link>
          <LogoutButton variant="compact" />
        </div>
      </div>

      {/* ChatApp covering 100% of remaining height & width */}
      <div className="w-full max-w-[1000px] flex-1 min-h-0 flex flex-col">
        <ChatApp />
      </div>
    </main>
  );
}
