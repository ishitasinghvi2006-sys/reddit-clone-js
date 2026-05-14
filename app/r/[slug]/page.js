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

  useEffect(() => {
    fetch(`/api/communities/${slug}`)
      .then((res) => {
        if (!res.ok) { setNotFound(true); setLoading(false); return null; }
        return res.json();
      })
      .then((data) => {
        if (data) {
          setCommunity(data);
          return fetch(`/api/posts?communityId=${data.id}`);
        }
      })
      .then((res) => res && res.json())
      .then((data) => {
        if (data) { setPosts(data); setLoading(false); }
      });
  }, [slug]);

  if (loading) return <div className="animate-pulse bg-white rounded-lg h-40" />;

  if (notFound) return (
    <div className="bg-white rounded-lg p-8 text-center">
      <p className="text-gray-500">Community not found</p>
      <Link href="/communities" className="text-orange-500 text-sm mt-2 block">Browse communities</Link>
    </div>
  );

  return (
    <div>
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

      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-gray-700">Posts</h2>
        {session && (
          <Link href={`/r/${slug}/create-post`}
            className="bg-orange-500 text-white px-4 py-1.5 rounded-full text-sm hover:bg-orange-600">
            + Create Post
          </Link>
        )}
      </div>

      {posts.length === 0 ? (
        <div className="bg-white rounded-lg p-8 text-center text-gray-400">
          <p>No posts yet. Be the first to post!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg p-4 hover:shadow-md transition-shadow flex gap-3">
              <div className="flex flex-col items-center">
                <VoteButton
                  postId={post.id}
                  initialVotes={post.voteScore || 0}
                  initialUserVote={null}
                />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-1">
                  Posted by u/{post.author.username}
                </p>
                <Link href={`/r/${slug}/${post.id}`}>
                  <h3 className="font-semibold text-gray-800 text-lg hover:text-orange-500 cursor-pointer">
                    {post.title}
                  </h3>
                </Link>
                {post.content && (
                  <p className="text-gray-600 text-sm mt-1 line-clamp-2">{post.content}</p>
                )}
                <div className="flex gap-4 mt-3 text-xs text-gray-500">
                  <Link href={`/r/${slug}/${post.id}`} className="hover:text-orange-500">
                    💬 {post._count.comments} comments
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