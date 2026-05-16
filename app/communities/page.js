"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function CommunitiesPage() {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/communities")
      .then((res) => res.json())
      .then((data) => { setCommunities(data); setLoading(false); });
  }, []);

  if (loading) return (
  <div className="space-y-3">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="bg-white rounded-lg p-4 animate-pulse flex gap-3">
        <div className="w-10 h-10 bg-gray-200 rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-1/3" />
          <div className="h-3 bg-gray-200 rounded w-1/4" />
        </div>
      </div>
    ))}
  </div>
);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">All Communities</h1>
        <Link href="/communities/create"
          className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm hover:bg-orange-600">
          + Create Community
        </Link>
      </div>
      {communities.length === 0 ? (
        <div className="bg-white rounded-lg p-8 text-center">
          <p className="text-gray-500 text-lg">No communities yet!</p>
          <Link href="/communities/create"
            className="inline-block mt-4 bg-orange-500 text-white px-4 py-2 rounded-full text-sm">
            Create First Community
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {communities.map((community) => (
            <Link key={community.id} href={`/r/${community.slug}`}
              className="bg-white rounded-lg p-4 flex items-center justify-between hover:shadow-md transition-shadow block">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {community.name[0].toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">r/{community.name}</p>
                  <p className="text-sm text-gray-500">{community._count.posts} posts</p>
                </div>
              </div>
              <span className="text-orange-500 text-sm">Visit →</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}