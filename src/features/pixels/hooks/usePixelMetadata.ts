import { useSuspenseQuery } from "@tanstack/react-query";

export interface PixelMetadata {
  text: string;
  link: string;
  imageCid: string;
}

async function fetchMetadata(metadataCid: string): Promise<PixelMetadata> {
  const url = `${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${metadataCid}`;
  const response = await fetch(url);

  const metadata = await response.json();

  return metadata as PixelMetadata;
}

const pixelMetadataQueryKey = {
  all: ["pixel-metadata"],
  specific: (metadataCid: string) => [
    ...pixelMetadataQueryKey.all,
    metadataCid,
  ],
};

export function usePixelMetadata(metadataCid: string) {
  return useSuspenseQuery({
    queryKey: pixelMetadataQueryKey.specific(metadataCid),
    queryFn: () => fetchMetadata(metadataCid),
    staleTime: 5 * 60 * 1000, // 5분간 캐시
    retry: false,
  });
}
