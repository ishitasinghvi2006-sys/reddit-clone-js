"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function CreatePostPage() {
  const { slug } = useParams();
  const { data: session } = useSession();
  const router = useRouter();
  const [form, setForm] = useState({ title: "", content: "" });
  const [community, setCommunity] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/communities/${slug}`)
      .then((res) => res.json())
      .then((data) => setCommunity(data));
  }, [slug]);

  if (!session) {
    return (
      <div className="bg-white rounded-lg p-8 text-center max-w-md mx-auto mt-10">
        <p className="text-gray-600 mb-4">You need to be logged in to post.</p>
        <Link href="/login" className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm">
          Login
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.title,
        content: form.content,
        communityId: community?.id,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Something went wrong");
      setLoading(false);
    } else {
      router.push(`/r/${slug}`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h1 className="text-xl font-bold text-gray-800 mb-1">Create a Post</h1>
        {community && (
          <p className="text-sm text-orange-500 mb-6">in r/{community.name}</p>
        )}

        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Title"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              maxLength={300}
            />
          </div>

          <div>
            <textarea
              placeholder="Text (optional)"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              rows={6}
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 border border-gray-300 text-gray-600 py-2 rounded-full text-sm hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !form.title}
              className="flex-1 bg-orange-500 text-white py-2 rounded-full text-sm hover:bg-orange-600 disabled:opacity-50"
            >
              {loading ? "Posting..." : "Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}