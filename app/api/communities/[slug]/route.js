import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const { slug } = await params;
    const community = await prisma.community.findUnique({
      where: { slug },
      include: { _count: { select: { posts: true } } },
    });
    if (!community) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(community);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}