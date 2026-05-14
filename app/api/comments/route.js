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

    const { content, postId } = await request.json();

    if (!content || !postId) {
      return NextResponse.json({ error: "Content and postId required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    const comment = await prisma.comment.create({
      data: {
        content,
        postId,
        authorId: user.id,
      },
      include: {
        author: { select: { username: true } },
      },
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}