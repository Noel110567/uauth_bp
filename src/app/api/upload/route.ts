import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File;
  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }
  const buffer = Buffer.from(await file.arrayBuffer());
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });
  const filename = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
  const filepath = path.join(uploadDir, filename);
  await writeFile(filepath, buffer);
  return NextResponse.json({ url: `/uploads/${filename}` });
}
