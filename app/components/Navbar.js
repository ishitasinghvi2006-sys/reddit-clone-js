"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-12 flex items-center justify-between">
        
        <Link href="/" className="text-orange-500 font-bold text-xl">
          Reddit Clone
        </Link>

        <div className="flex items-center gap-3">
          {session ? (
            <>
              <Link href={`/u/${session.user.username}`} className="text-sm text-gray-600 hover:text-orange-500">
              u/{session.user.username}
              </Link>
              <Link
                href="/communities/create"
                className="text-sm bg-orange-500 text-white px-3 py-1 rounded-full hover:bg-orange-600"
              >
                + Create
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="text-sm border border-gray-300 px-3 py-1 rounded-full hover:bg-gray-100"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm border border-orange-500 text-orange-500 px-3 py-1 rounded-full hover:bg-orange-50"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="text-sm bg-orange-500 text-white px-3 py-1 rounded-full hover:bg-orange-600"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}