"use client";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";

export default function HeaderWithSession() {
  const { data: session, status } = useSession();
  const user = session?.user;
  return (
    <header className="w-full fixed top-0 left-0 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 text-white px-6 py-3 shadow z-50 flex items-center justify-between">
      <Link href="/" className="text-2xl pl-10 md:text-3xl font-light tracking-tight hover:underline focus:outline-none">
        The Sangguniang Bayan ng Capalonga
      </Link>
      <div className="flex items-center gap-3 min-w-[120px]">
        {status === "loading" ? (
          <div className="flex items-center gap-2 animate-pulse">
            <div className="w-7 h-7 rounded-full bg-blue-200/40" />
            <div className="h-4 w-16 bg-blue-200/40 rounded" />
            <div className="h-7 w-16 bg-blue-200/40 rounded ml-2" />
          </div>
        ) : user ? (
          <>
            <span className="flex items-center gap-2 text-xs font-light tracking-tight text-blue-100">
              {user.image && (
                <img src={user.image} alt="User" className="w-7 h-7 rounded-full border border-blue-200 bg-white object-cover" />
              )}
              {user.name}
            </span>
            <button
              className="bg-blue-800 hover:bg-blue-900 text-xs text-white rounded px-3 py-2 transition border border-blue-300"
              onClick={() => signOut()}
            >
              Log out
            </button>
          </>
        ) : (
          <button
            className="bg-blue-800 hover:bg-blue-900 text-xs text-white rounded px-3 py-2 transition border border-blue-300"
            onClick={() => signIn()}
          >
            Log in
          </button>
        )}
      </div>
    </header>
  );
}
