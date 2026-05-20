import SessionProvider from "./components/SessionProvider";
import Navbar from "./components/Navbar";
import "./globals.css";

export const metadata = {
  title: {
    default: "Reddit Clone",
    template: "%s | Reddit Clone",
  },
  description: "A Reddit clone built with Next.js, Prisma and Supabase",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 min-h-screen">
        <SessionProvider>
          <Navbar />
          <main className="max-w-5xl mx-auto px-4 py-6">
            {children}
          </main>
        </SessionProvider>
      </body>
    </html>
  );
}
