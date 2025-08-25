import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  // Path to the public/slider directory
  const sliderDir = path.join(process.cwd(), "public", "slider");
  let files: string[] = [];
  try {
    files = fs.readdirSync(sliderDir)
      .filter((file) => /\.(jpe?g|png|gif|webp)$/i.test(file))
      .map((file) => `/slider/${file}`);
  } catch (e) {
    // Directory may not exist or be empty
    files = [];
  }
  return NextResponse.json({ images: files });
}
