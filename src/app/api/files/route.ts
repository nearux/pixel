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

    const { id: imageId, cid: imageCid } = await pinata.upload.public.file(
      renamedFile
    );

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
    const { id: metadataId, cid: metadataCid } =
      await pinata.upload.public.file(metadataFile);

    return NextResponse.json(
      {
        metadataCid: metadataCid.toString(),
        // 삭제할 때 사용
        metadataId: metadataId.toString(),
        imageId: imageId.toString(),
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
    const { ids } = await request.json();

    await pinata.files.public.delete([...ids]);

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
