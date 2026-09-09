import { auth0 } from "@/lib/auth0";
import LoginButton from "@/components/LoginButton";
import LogoutButton from "@/components/LogoutButton";
import Profile from "@/components/Profile";
import Image from "next/image";
import LogoWithOutBG from "@/../public/LogoWithOutBG.png"

export default async function Home() {
  const session = await auth0.getSession();
  const user = session?.user;

  return (
    <main className="min-h-screen bgs flex flex-col items-center justify-center gap-4 w-full !h-[400px]">
      <div className="bg-white rounded-[28px] shadow-[0_4px_32px_rgba(0,0,0,0.08)] px-12 py-14 flex flex-col items-center gap-4 w-[360px] h-1/2">
        <Image
          src={LogoWithOutBG}
          alt="Logo-img"
          // className=""
          width="68"
          height="68"
          viewBox="0 0 40 68"
        />

        {user ? (
          <>
            <h1 className="text-[17px] font-bold text-gray-900 tracking-tight">
              Your account
            </h1>
            <div className="w-full h-px bg-gray-100" />
            <Profile />
            <LogoutButton />
          </>
        ) : (
          <>
            <h1 className="text-[17px] font-bold text-gray-900 tracking-tight">
              Welcome to Let's Chat
            </h1>
            <p className="text-[13px] text-gray-400 text-center leading-relaxed -mt-2">
              Get started by logging in to your account
            </p>
            <div className="h-3" />
            <LoginButton />
          </>
        )}
      </div>

      <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
        <span>Powered by</span>
        <img
          src="https://cdn.auth0.com/quantum-assets/dist/latest/logos/auth0/auth0-lockup-en-onlight.svg"
          alt="Auth0"
          className="h-3 opacity-40"
        />
      </div>
    </main>
  );
}
