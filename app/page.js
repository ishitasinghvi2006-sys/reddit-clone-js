"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import VoteButton from "./components/VoteButton";

export default function Home() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("new");

  useEffect(() => {
    fetch("/api/posts")
      .then((res) => res.json())
      .then((data) => { setPosts(data); setLoading(false); });
    fetch("/api/communities")
      .then((res) => res.json())
      .then((data) => {
  const unique = data.filter((c, index, self) =>
    index === self.findIndex((t) => t.slug === c.slug)
  );
  setCommunities(unique.slice(0, 5));
});
  }, []);

  const sortedPosts = [...posts].sort((a, b) => {
    if (sort === "top") return (b.voteScore || 0) - (a.voteScore || 0);
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return (
    <div className="max-w-5xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Left - Feed */}
        <div className="md:col-span-2">
          {/* Create post box */}
          {session && (
            <div className="bg-white rounded-lg p-3 mb-4 flex items-center gap-3 shadow-sm">
              <div className="w-9 h-9 bg-orange-100 rounded-full flex items-center justify-center text-orange-500 font-bold">
                {session.user.username?.[0]?.toUpperCase()}
              </div>
              <Link href="/communities"
                className="flex-1 bg-gray-100 rounded px-4 py-2 text-sm text-gray-400 hover:bg-gray-200">
                Create a post...
              </Link>
            </div>
          )}

          {/* Sort buttons */}
          <div className="bg-white rounded-lg p-3 mb-4 flex gap-2 shadow-sm">
            <button onClick={() => setSort("new")}
              className={`px-4 py-1.5 rounded-full text-sm font-medium ${sort === "new" ? "bg-orange-500 text-white" : "text-gray-500 hover:bg-gray-100"}`}>
              🕐 New
            </button>
            <button onClick={() => setSort("top")}
              className={`px-4 py-1.5 rounded-full text-sm font-medium ${sort === "top" ? "bg-orange-500 text-white" : "text-gray-500 hover:bg-gray-100"}`}>
              🔥 Top
            </button>
          </div>

          {/* Posts feed */}
          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-4 animate-pulse h-24" />
              ))}
            </div>
          ) : sortedPosts.length === 0 ? (
            <div className="bg-white rounded-lg p-8 text-center">
              <p className="text-gray-500 mb-4">No posts yet!</p>
              <Link href="/communities/create"
                className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm hover:bg-orange-600">
                Create a Community
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {sortedPosts.map((post) => (
                <div key={post.id} className="bg-white rounded-lg p-4 hover:shadow-md transition-shadow flex gap-3">
                  <div className="flex flex-col items-center pt-1">
                    <VoteButton postId={post.id} initialVotes={post.voteScore || 0} initialUserVote={null} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-400 mb-1">
                      <Link href={`/r/${post.community.slug}`} className="text-orange-500 hover:underline">
                        r/{post.community.name}
                      </Link>
                      {" • "}Posted by u/{post.author.username} • {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                    <Link href={`/r/${post.community.slug}/${post.id}`}>
                      <h3 className="font-semibold text-gray-800 hover:text-orange-500 cursor-pointer">
                        {post.title}
                      </h3>
                    </Link>
                    {post.content && (
                      <p className="text-gray-500 text-sm mt-1 line-clamp-2">{post.content}</p>
                    )}
                    <div className="flex gap-4 mt-2 text-xs text-gray-400">
                      <Link href={`/r/${post.community.slug}/${post.id}`} className="hover:text-orange-500">
                        💬 {post._count.comments} {post._count.comments === 1 ? "comment" : "comments"}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div className="space-y-4">
          {/* Welcome card */}
          <div className="bg-orange-500 rounded-lg p-4 text-white">
            <h2 className="font-bold mb-1">Home</h2>
            <p className="text-orange-100 text-sm mb-3">
              Your personal Reddit Clone front page.
            </p>
            <div className="space-y-2">
              <Link href="/communities/create"
                className="block text-center bg-white text-orange-500 py-1.5 rounded-full text-sm font-medium hover:bg-orange-50">
                Create Community
              </Link>
              {!session && (
                <Link href="/register"
                  className="block text-center border border-white text-white py-1.5 rounded-full text-sm font-medium hover:bg-orange-600">
                  Sign Up
                </Link>
              )}
            </div>
          </div>

          {/* Top communities */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h2 className="font-bold text-gray-800 mb-3 text-sm">Top Communities</h2>
            {communities.map((c, i) => (
              <Link key={c.id} href={`/r/${c.slug}`}
                className="flex items-center gap-2 p-2 rounded hover:bg-gray-50 group">
                <span className="text-gray-400 text-xs w-4">{i + 1}</span>
                <div className="w-7 h-7 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {c.name[0].toUpperCase()}
                </div>
                <span className="text-sm text-gray-700 group-hover:text-orange-500">r/{c.name}</span>
              </Link>
            ))}
            <Link href="/communities"
              className="block mt-3 text-center text-orange-500 text-sm hover:underline">
              View all communities →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}