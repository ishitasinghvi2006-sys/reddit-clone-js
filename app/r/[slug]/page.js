"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import VoteButton from "../../components/VoteButton";

export default function CommunityPage() {
  const { slug } = useParams();
  const { data: session } = useSession();
  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [sort, setSort] = useState("new");

  useEffect(() => {
  fetch(`/api/communities/${slug}`)
    .then((res) => {
      if (!res.ok) { setNotFound(true); setLoading(false); return null; }
      return res.json();
    })
    .then((data) => {
      if (!data) return;
      setCommunity(data);
      return fetch(`/api/posts?communityId=${data.id}`);
    })
    .then((res) => {
      if (!res) return;
      if (!res.ok) return [];
      return res.json();
    })
    .then((data) => {
      if (data) { setPosts(Array.isArray(data) ? data : []); setLoading(false); }
    })
    .catch(() => { setLoading(false); setNotFound(true); });
}, [slug]);

  const sortedPosts = [...posts].sort((a, b) => {
    if (sort === "top") return (b.voteScore || 0) - (a.voteScore || 0);
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  if (loading) return (
    <div className="space-y-3">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-white rounded-lg p-4 animate-pulse h-24" />
      ))}
    </div>
  );

  if (notFound) return (
    <div className="bg-white rounded-lg p-8 text-center">
      <p className="text-gray-500">Community not found</p>
      <Link href="/communities" className="text-orange-500 text-sm mt-2 block">Browse communities</Link>
    </div>
  );

  return (
    <div>
      {/* Community Header */}
      <div className="bg-orange-500 rounded-lg p-6 mb-4 text-white">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-orange-500 font-bold text-2xl">
            {community.name[0].toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold">r/{community.name}</h1>
            {community.description && (
              <p className="text-orange-100 text-sm">{community.description}</p>
            )}
          </div>
        </div>
        <p className="text-orange-100 text-sm">{community._count.posts} posts</p>
      </div>

      {/* Sort + Create Post bar */}
      <div className="bg-white rounded-lg p-3 mb-4 flex items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => setSort("new")}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              sort === "new" ? "bg-orange-500 text-white" : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            🕐 New
          </button>
          <button
            onClick={() => setSort("top")}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              sort === "top" ? "bg-orange-500 text-white" : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            🔥 Top
          </button>
        </div>
        {session && (
          <Link href={`/r/${slug}/create-post`}
            className="bg-orange-500 text-white px-4 py-1.5 rounded-full text-sm hover:bg-orange-600">
            + Create Post
          </Link>
        )}
      </div>

      {/* Posts */}
      {sortedPosts.length === 0 ? (
        <div className="bg-white rounded-lg p-8 text-center text-gray-400">
          <p className="text-lg mb-2">No posts yet!</p>
          {session && (
            <Link href={`/r/${slug}/create-post`}
              className="inline-block mt-4 bg-orange-500 text-white px-4 py-2 rounded-full text-sm hover:bg-orange-600">
              Create Post
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {sortedPosts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg p-4 hover:shadow-md transition-shadow flex gap-3">
              <div className="flex flex-col items-center pt-1">
                <VoteButton
                  postId={post.id}
                  initialVotes={post.voteScore || 0}
                  initialUserVote={null}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-400 mb-1">
                  Posted by <span className="text-orange-500">u/{post.author.username}</span> • {new Date(post.createdAt).toLocaleDateString()}
                </p>
                <Link href={`/r/${slug}/${post.id}`}>
                  <h3 className="font-semibold text-gray-800 text-base hover:text-orange-500 cursor-pointer">
                    {post.title}
                  </h3>
                </Link>
                {post.content && (
                  <p className="text-gray-500 text-sm mt-1 line-clamp-2">{post.content}</p>
                )}
                {post.imageUrl && (
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="mt-2 rounded-lg max-h-64 object-cover w-full"
                  />
                )}
                <div className="flex gap-4 mt-2 text-xs text-gray-400">
                  <Link href={`/r/${slug}/${post.id}`} className="hover:text-orange-500">
                    💬 {post._count.comments} {post._count.comments === 1 ? "comment" : "comments"}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}