import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const { username } = await params;

    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        createdAt: true,
        posts: {
          orderBy: { createdAt: "desc" },
          include: {
            community: { select: { name: true, slug: true } },
            _count: { select: { votes: true, comments: true } },
          },
        },
        comments: {
          orderBy: { createdAt: "desc" },
          take: 10,
          include: {
            post: { select: { title: true, id: true } },
          },
        },
        _count: {
          select: { posts: true, comments: true },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}