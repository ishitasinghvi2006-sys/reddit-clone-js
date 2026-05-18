"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

export default function Navbar() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 h-12 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
            R
          </div>
          <span className="text-orange-500 font-bold text-lg hidden sm:block">
            Reddit Clone
          </span>
        </Link>

        {/* Search bar */}
        <div className="hidden md:flex flex-1 max-w-sm mx-4">
          <input
            type="text"
            placeholder="Search Reddit Clone..."
            className="w-full bg-gray-100 border border-gray-200 rounded-full px-4 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:bg-white"
          />
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {session ? (
            <>
              <Link href="/communities/create"
                className="hidden sm:block text-sm bg-orange-500 text-white px-3 py-1 rounded-full hover:bg-orange-600">
                + Create
              </Link>
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-1.5 text-sm border border-gray-200 px-3 py-1 rounded-full hover:bg-gray-50"
                >
                  <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {session.user.username?.[0]?.toUpperCase()}
                  </div>
                  <span className="hidden sm:block text-gray-700">
                    u/{session.user.username}
                  </span>
                  <span className="text-gray-400 text-xs">▾</span>
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <Link
                      href={`/u/${session.user.username}`}
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      👤 Profile
                    </Link>
                    <Link
                      href="/communities/create"
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      ➕ Create Community
                    </Link>
                    <hr className="my-1" />
                    <button
                      onClick={() => { signOut({ callbackUrl: "/login" }); setMenuOpen(false); }}
                      className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-50"
                    >
                      🚪 Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link href="/login"
                className="text-sm border border-orange-500 text-orange-500 px-3 py-1 rounded-full hover:bg-orange-50">
                Login
              </Link>
              <Link href="/register"
                className="text-sm bg-orange-500 text-white px-3 py-1 rounded-full hover:bg-orange-600">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}