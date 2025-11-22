import { NextResponse, type NextRequest } from "next/server";

import { pinata } from "@/shared/lib/pinata";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const title = formData.get("title") as string;
    const link = formData.get("link") as string;
    const pixelId = formData.get("pixelId") as string;
    const imageFile = formData.get("image")! as File;

    const fileExtension = imageFile.name.split(".").pop() || "png";
    const fileName = `${pixelId}_${Date.now()}.${fileExtension}`;
    const renamedFile = new File([imageFile], fileName, {
      type: imageFile.type,
    });

    const { cid: imageCid } = await pinata.upload.public.file(renamedFile);

    const metadata = {
      text: title,
      link: link,
      imageCid: imageCid.toString(),
    };

    const metadataBlob = new Blob([JSON.stringify(metadata)], {
      type: "application/json",
    });

    const metadataFile = new File(
      [metadataBlob],
      `${pixelId}_${Date.now()}_metadata.json`
    );

    const { cid: metadataCid } = await pinata.upload.public.file(metadataFile);

    return NextResponse.json(
      {
        metadataCid: metadataCid.toString(),
      },
      { status: 200 }
    );
  } catch (e) {
    console.error("Error uploading to Pinata:", e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { cids } = await request.json();

    const files = await pinata.files.public.list();

    const filterIds = files.files
      .filter((file) => cids.includes(file.cid))
      .map((file) => file.id);

    await pinata.files.public.delete([...filterIds]);

    return NextResponse.json(
      { message: "Files deleted successfully" },
      { status: 200 }
    );
  } catch (e) {
    console.error("Error deleting from Pinata:", e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
