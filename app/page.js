import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-2xl mx-auto text-center py-12">
      <h1 className="text-4xl font-bold text-orange-500 mb-4">
        Welcome to Reddit Clone
      </h1>
      <p className="text-gray-600 mb-8">
        Discover communities, share posts, and join the conversation.
      </p>
      <div className="flex gap-4 justify-center">
        <Link
          href="/communities"
          className="bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600"
        >
          Browse Communities
        </Link>
        <Link
          href="/communities/create"
          className="border border-orange-500 text-orange-500 px-6 py-2 rounded-full hover:bg-orange-50"
        >
          Create Community
        </Link>
      </div>
    </div>
  );
}