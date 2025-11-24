import { useSuspenseQuery } from "@tanstack/react-query";

import { pinata } from "@/shared/lib/pinata";

export interface PixelMetadata {
  text: string;
  link: string;
  imageCid: string;
}

export async function fetchMetadata(
  metadataCid: string
): Promise<PixelMetadata> {
  const { data } = await pinata.gateways.public.get(metadataCid);

  return data as unknown as PixelMetadata;
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
    retry: false,
  });
}
