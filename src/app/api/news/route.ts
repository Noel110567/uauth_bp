import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/news - fetch all news, sorted by priority desc, date desc
export async function GET() {
  try {
    const news = await prisma.news.findMany({
      orderBy: [
        { priority: 'desc' },
        { date: 'desc' },
      ],
    });
    return NextResponse.json(news);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
}
