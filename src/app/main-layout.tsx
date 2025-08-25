
"use client"

import { ReactNode } from "react";
import Link from "next/link";
import { Sidebar } from "../components/Sidebar";
import NewsCarouselWrapper from "./dashboard/NewsCarouselWrapper";
import { useSession, signIn, signOut } from "next-auth/react";

export default function MainLayout({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const user = session?.user;

  return (
    <div className="min-h-screen flex flex-col">

      <div className="flex flex-1 min-h-0 pt-[64px] pb-[40px]">
        <Sidebar />
        <main
          className="flex-1 bg-white dark:bg-black p-0 m-0 transition-all duration-200 min-h-0 flex flex-col items-stretch justify-start"
        >
          {children}
        </main>
      </div>
      {/* Footer at the bottom of the screen */}
      <footer className="w-full fixed bottom-0 left-0 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 text-xs text-blue-100 px-6 py-2 border-t border-blue-800 z-50 text-center">
        © 2022. All rights reserved,  SBCapalonga.com  
      </footer>
    </div>
  );
}
