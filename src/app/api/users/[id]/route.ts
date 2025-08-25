import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(req, { params }) {
  const { role } = await req.json();
  const { id } = params;
  if (!role || !id) return NextResponse.json({ error: "Missing data" }, { status: 400 });
  const user = await prisma.user.update({ where: { id: Number(id) }, data: { role } });
  return NextResponse.json({ user });
}

export async function DELETE(req, { params }) {
  const { id } = params;
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  await prisma.user.delete({ where: { id: Number(id) } });
  return NextResponse.json({ success: true });
}
