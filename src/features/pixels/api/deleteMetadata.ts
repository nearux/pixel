import { fetchMetadata } from "../hooks/usePixelMetadata";

export const deleteMetadata = async (metadataCid: string) => {
  const metadata = await fetchMetadata(metadataCid);

  await fetch("/api/files", {
    method: "DELETE",
    body: JSON.stringify({
      cids: [metadataCid, metadata.imageCid],
    }),
  });
};
