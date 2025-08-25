import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      username: true,
      role: true,
    },
    orderBy: { email: "asc" },
  });
  return NextResponse.json({ users: users.map(u => ({
    id: u.id,
    email: u.email,
    name: u.username,
    role: u.role,
  })) });
}

export async function POST(req) {
  const { email, username, password, role } = await req.json();
  if (!email || !username || !password || !role) {
    return NextResponse.json({ error: "All fields are required." }, { status: 400 });
  }
  // Check for existing user
  const exists = await prisma.user.findFirst({ where: { OR: [{ email }, { username }] } });
  if (exists) {
    return NextResponse.json({ error: "Email or username already exists." }, { status: 400 });
  }
  const hashed = await hash(password, 10);
  const user = await prisma.user.create({
    data: { email, username, password: hashed, role },
  });
  return NextResponse.json({ user });
}
