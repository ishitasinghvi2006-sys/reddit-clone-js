import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import SessionProvider from "./components/SessionProvider";
import Navbar from "./components/Navbar";
import "./globals.css";

export const metadata = {
  title: "Reddit Clone",
  description: "A Reddit clone built with Next.js",
};

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="en">
      <body className="bg-gray-100 min-h-screen">
        <SessionProvider session={session}>
          <Navbar />
          <main className="max-w-5xl mx-auto px-4 py-6">
            {children}
          </main>
        </SessionProvider>
      </body>
    </html>
  );
}