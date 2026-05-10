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

    const { title, content, communityId } = await request.json();

    if (!title || !communityId) {
      return NextResponse.json({ error: "Title and community required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    const post = await prisma.post.create({
      data: {
        title,
        content,
        communityId,
        authorId: user.id,
      },
      include: {
        author: { select: { username: true } },
        community: { select: { name: true, slug: true } },
        _count: { select: { votes: true, comments: true } },
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const communityId = searchParams.get("communityId");

    const posts = await prisma.post.findMany({
      where: communityId ? { communityId } : {},
      orderBy: { createdAt: "desc" },
      include: {
        author: { select: { username: true } },
        community: { select: { name: true, slug: true } },
        _count: { select: { votes: true, comments: true } },
      },
    });

    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}