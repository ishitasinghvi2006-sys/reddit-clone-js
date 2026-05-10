"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function CreateCommunityPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", description: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!session) {
    return (
      <div className="bg-white rounded-lg p-8 text-center max-w-md mx-auto mt-10">
        <p className="text-gray-600 mb-4">You need to be logged in.</p>
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
    const res = await fetch("/api/communities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Something went wrong");
      setLoading(false);
    } else {
      router.push(`/r/${data.slug}`);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h1 className="text-xl font-bold text-gray-800 mb-6">Create a Community</h1>
        {error && <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Community Name</label>
            <div className="flex items-center border border-gray-300 rounded px-3 py-2">
              <span className="text-gray-400 text-sm mr-1">r/</span>
              <input
                type="text"
                className="flex-1 text-sm focus:outline-none"
                placeholder="mycommunity"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
            <textarea
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              rows={3}
              placeholder="What is this community about?"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={() => router.back()}
              className="flex-1 border border-gray-300 text-gray-600 py-2 rounded-full text-sm hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 bg-orange-500 text-white py-2 rounded-full text-sm hover:bg-orange-600 disabled:opacity-50">
              {loading ? "Creating..." : "Create Community"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}