"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import VoteButton from "../../../components/VoteButton";

export default function PostPage() {
  const { slug, postId } = useParams();
  const { data: session } = useSession();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    fetch(`/api/posts/${postId}`)
      .then((res) => res.json())
      .then((data) => {
        setPost(data);
        setComments(data.comments || []);
        setLoading(false);
      });
  }, [postId]);

  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setSubmitting(true);

    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: comment, postId }),
    });

    const data = await res.json();

    if (res.ok) {
      setComments([data, ...comments]);
      setComment("");
    }
    setSubmitting(false);
  };

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
        <div className="flex gap-4">
          <VoteButton
            postId={post.id}
            initialVotes={
              (post.votes || []).filter((v) => v.type === "UP").length -
              (post.votes || []).filter((v) => v.type === "DOWN").length
            }
            initialUserVote={null}
          />
          <div className="flex-1">
            <p className="text-xs text-gray-500 mb-2">
              r/{post.community.name} • Posted by u/{post.author.username}
            </p>
            <h1 className="text-2xl font-bold text-gray-800 mb-3">{post.title}</h1>
            {post.content && (
              <p className="text-gray-700 leading-relaxed">{post.content}</p>
            )}
            <div className="flex gap-4 mt-4 text-sm text-gray-500">
              <span>💬 {comments.length} comments</span>
            </div>
          </div>
        </div>
      </div>

      {/* Comment Form */}
      <div className="bg-white rounded-lg p-6 shadow-sm mb-4">
        {session ? (
          <form onSubmit={handleComment}>
            <p className="text-sm text-gray-600 mb-2">
              Comment as <span className="text-orange-500 font-medium">u/{session.user.username}</span>
            </p>
            <textarea
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              rows={4}
              placeholder="What are your thoughts?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            />
            <button
              type="submit"
              disabled={submitting || !comment.trim()}
              className="mt-2 bg-orange-500 text-white px-4 py-1.5 rounded-full text-sm hover:bg-orange-600 disabled:opacity-50"
            >
              {submitting ? "Posting..." : "Comment"}
            </button>
          </form>
        ) : (
          <p className="text-sm text-gray-600">
            <Link href="/login" className="text-orange-500 hover:underline">Login</Link> to comment
          </p>
        )}
      </div>

      {/* Comments List */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="font-semibold text-gray-800 mb-4">
          Comments ({comments.length})
        </h2>
        {comments.length === 0 ? (
          <p className="text-gray-400 text-sm">No comments yet. Be the first!</p>
        ) : (
          <div className="space-y-4">
            {comments.map((c) => (
              <div key={c.id} className="border-l-2 border-orange-200 pl-4 py-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-orange-500">
                    u/{c.author.username}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-700 text-sm">{c.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}