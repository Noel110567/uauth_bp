import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(req, { params }) {
  const { id } = params;
  const { title, summary, fullStory, images, date, slug, priority } = await req.json();
  if (!id || !title || !summary || !date || !slug) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }
  const news = await prisma.news.update({
    where: { id: Number(id) },
    data: {
      title,
      summary,
      fullStory,
      images: images ?? [],
      date: new Date(date),
      slug,
      priority: priority ?? 0,
    },
  });
  return NextResponse.json({ news });
}

export async function GET(req, { params }) {
  const { id } = params;
  if (!id) return NextResponse.json({ error: "Missing id." }, { status: 400 });
  const news = await prisma.news.findUnique({ where: { id: Number(id) } });
  if (!news) return NextResponse.json({ error: "News not found." }, { status: 404 });
  return NextResponse.json({ news });
}
