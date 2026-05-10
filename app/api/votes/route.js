import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Not logged in" }, { status: 401 });
    }

    const { postId, type } = await request.json();

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    const existingVote = await prisma.vote.findUnique({
      where: {
        userId_postId: { userId: user.id, postId },
      },
    });

    if (existingVote) {
      if (existingVote.type === type) {
        // Same vote — remove it (toggle off)
        await prisma.vote.delete({
          where: { userId_postId: { userId: user.id, postId } },
        });
        return NextResponse.json({ message: "Vote removed", action: "removed" });
      } else {
        // Different vote — update it
        await prisma.vote.update({
          where: { userId_postId: { userId: user.id, postId } },
          data: { type },
        });
        return NextResponse.json({ message: "Vote updated", action: "updated" });
      }
    }

    // New vote
    await prisma.vote.create({
      data: { type, userId: user.id, postId },
    });

    return NextResponse.json({ message: "Vote added", action: "added" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}