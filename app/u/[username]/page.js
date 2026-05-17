"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function ProfilePage() {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("posts");

  useEffect(() => {
    fetch(`/api/users/${username}`)
      .then((res) => res.json())
      .then((data) => { setUser(data); setLoading(false); });
  }, [username]);

  if (loading) return (
    <div className="space-y-3">
      <div className="bg-white rounded-lg h-32 animate-pulse" />
      <div className="bg-white rounded-lg h-24 animate-pulse" />
    </div>
  );

  if (!user || user.error) return (
    <div className="bg-white rounded-lg p-8 text-center">
      <p className="text-gray-500">User not found</p>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto">
      {/* Profile Header */}
      <div className="bg-white rounded-lg p-6 shadow-sm mb-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-2xl">
            {username[0].toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">u/{username}</h1>
            <p className="text-gray-400 text-sm">
              Joined {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-6 mt-6 pt-4 border-t border-gray-100">
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-500">{user._count.posts}</p>
            <p className="text-xs text-gray-400">Posts</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-500">{user._count.comments}</p>
            <p className="text-xs text-gray-400">Comments</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm mb-4">
        <div className="flex border-b border-gray-100">
          <button
            onClick={() => setActiveTab("posts")}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === "posts"
                ? "text-orange-500 border-b-2 border-orange-500"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Posts ({user._count.posts})
          </button>
          <button
            onClick={() => setActiveTab("comments")}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === "comments"
                ? "text-orange-500 border-b-2 border-orange-500"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Comments ({user._count.comments})
          </button>
        </div>

        <div className="p-4">
          {/* Posts Tab */}
          {activeTab === "posts" && (
            <div className="space-y-3">
              {user.posts.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-4">No posts yet</p>
              ) : (
                user.posts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/r/${post.community.slug}/${post.id}`}
                    className="block p-3 rounded-lg hover:bg-gray-50 border border-gray-100"
                  >
                    <p className="text-xs text-orange-500 mb-1">
                      r/{post.community.name}
                    </p>
                    <p className="font-medium text-gray-800 text-sm">{post.title}</p>
                    <div className="flex gap-3 mt-1 text-xs text-gray-400">
                      <span>👍 {post._count.votes} votes</span>
                      <span>💬 {post._count.comments} comments</span>
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                  </Link>
                ))
              )}
            </div>
          )}

          {/* Comments Tab */}
          {activeTab === "comments" && (
            <div className="space-y-3">
              {user.comments.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-4">No comments yet</p>
              ) : (
                user.comments.map((comment) => (
                  <div key={comment.id} className="p-3 rounded-lg border border-gray-100">
                    <p className="text-xs text-gray-400 mb-1">
                      on: <span className="text-orange-500">{comment.post.title}</span>
                    </p>
                    <p className="text-sm text-gray-700">{comment.content}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}