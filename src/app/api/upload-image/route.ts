import { writeFile } from "fs/promises";
import { join } from "path";

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("image") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No image file provided" },
        { status: 400 }
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Invalid file type. Only images are allowed." },
        { status: 400 }
      );
    }

    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File size exceeds 5MB limit." },
        { status: 400 }
      );
    }

    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const timeHash = `${hours}${minutes}`;

    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const fileName = `${timeHash}_${originalName}`;

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const publicDir = join(process.cwd(), "public", "images");
    const filePath = join(publicDir, fileName);

    await writeFile(filePath, buffer);

    const imageUrl = `/images/${fileName}`;

    return NextResponse.json({ imageUrl }, { status: 200 });
  } catch (error) {
    console.error("Error uploading image:", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}
