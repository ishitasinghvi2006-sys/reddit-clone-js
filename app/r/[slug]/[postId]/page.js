"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function PostPage() {
  const { slug, postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/posts/${postId}`)
      .then((res) => res.json())
      .then((data) => { setPost(data); setLoading(false); });
  }, [postId]);

  if (loading) return <div className="animate-pulse bg-white rounded-lg h-40" />;
  if (!post || post.error) return (
    <div className="bg-white rounded-lg p-8 text-center">
      <p className="text-gray-500">Post not found</p>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto">
      {/* Back link */}
      <Link href={`/r/${slug}`} className="text-orange-500 text-sm mb-4 block hover:underline">
        ← Back to r/{slug}
      </Link>

      {/* Post */}
      <div className="bg-white rounded-lg p-6 shadow-sm mb-4">
        <p className="text-xs text-gray-500 mb-2">
          r/{post.community.name} • Posted by u/{post.author.username}
        </p>
        <h1 className="text-2xl font-bold text-gray-800 mb-3">{post.title}</h1>
        {post.content && (
          <p className="text-gray-700 leading-relaxed">{post.content}</p>
        )}
        <div className="flex gap-4 mt-4 text-sm text-gray-500">
          <span>👍 {post._count.votes} votes</span>
          <span>💬 {post._count.comments} comments</span>
        </div>
      </div>

      {/* Comments */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="font-semibold text-gray-800 mb-4">
          Comments ({post.comments.length})
        </h2>
        {post.comments.length === 0 ? (
          <p className="text-gray-400 text-sm">No comments yet. Be the first!</p>
        ) : (
          <div className="space-y-4">
            {post.comments.map((comment) => (
              <div key={comment.id} className="border-l-2 border-orange-200 pl-4">
                <p className="text-xs text-gray-500 mb-1">u/{comment.author.username}</p>
                <p className="text-gray-700 text-sm">{comment.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}