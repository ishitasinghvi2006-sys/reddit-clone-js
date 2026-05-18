"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function VoteButton({ postId, initialVotes, initialUserVote }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [votes, setVotes] = useState(initialVotes || 0);
  const [userVote, setUserVote] = useState(initialUserVote || null);
  const [loading, setLoading] = useState(false);

  const handleVote = async (type) => {
    if (!session) {
      toast.error("Login to vote!");
      router.push("/login");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/votes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId, type }),
    });

    const data = await res.json();

    if (res.ok) {
      if (data.action === "removed") {
        setVotes(userVote === "UP" ? votes - 1 : votes + 1);
        setUserVote(null);
      } else if (data.action === "updated") {
        setVotes(type === "UP" ? votes + 2 : votes - 2);
        setUserVote(type);
      } else {
        setVotes(type === "UP" ? votes + 1 : votes - 1);
        setUserVote(type);
      }
    }

    setLoading(false);
  };

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={(e) => { e.preventDefault(); handleVote("UP"); }}
        disabled={loading}
        title="Upvote"
        className={`p-1 rounded transition-all hover:scale-110 ${
          userVote === "UP" ? "text-orange-500" : "text-gray-400 hover:text-orange-500"
        } disabled:opacity-50`}
      >
        ▲
      </button>

      <span className={`font-bold text-sm min-w-[24px] text-center ${
        userVote === "UP" ? "text-orange-500" :
        userVote === "DOWN" ? "text-blue-500" : "text-gray-700"
      }`}>
        {votes}
      </span>

      <button
        onClick={(e) => { e.preventDefault(); handleVote("DOWN"); }}
        disabled={loading}
        title="Downvote"
        className={`p-1 rounded transition-all hover:scale-110 ${
          userVote === "DOWN" ? "text-blue-500" : "text-gray-400 hover:text-blue-500"
        } disabled:opacity-50`}
      >
        ▼
      </button>
    </div>
  );
}