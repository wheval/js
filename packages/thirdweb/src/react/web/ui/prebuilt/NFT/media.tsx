import { useSuspenseQuery } from "@tanstack/react-query";
import { getNFT as getNFT721 } from "../../../../../extensions/erc721/read/getNFT.js";
import { getNFT as getNFT1155 } from "../../../../../extensions/erc1155/read/getNFT.js";
import type { NFT } from "../../../../../utils/nft/parseNft.js";
import { MediaRenderer } from "../../MediaRenderer/MediaRenderer.js";
import type { MediaRendererProps } from "../../MediaRenderer/types.js";
import { type NFTProviderProps, useNFTContext } from "./provider.js";

/**
 * @component
 * The props for the <NFT.Media /> component
 * It is similar to the [`MediaRendererProps`](https://portal.thirdweb.com/references/typescript/v5/MediaRendererProps)
 * (excluding `src`, `poster` and `client`) that you can
 * use to style the NFT.Media
 */
export type NFTMediaProps = Omit<
  MediaRendererProps,
  "src" | "poster" | "client"
>;

/**
 * This component fetches and displays an NFT's media. It uses thirdweb [`MediaRenderer`](https://portal.thirdweb.com/refernces/typescript/v5/MediaRenderer) under the hood
 * so you can style it just like how you would style a MediaRenderer.
 * @returns A MediaRenderer component
 *
 * Since this component has an internal loading state (for when the NFT media is being fetched),
 * you must wrap it with React.Suspense to make it work.
 *
 * @component
 * @example
 * ### Basic usage
 *
 * This will show the media for tokenId #0 from the `nftContract` collection
 *
 * ```tsx
 * import { getContract } from "thirdweb";
 * import { NFT } from "thirdweb/react";
 *
 * const nftContract = getContract({
 *   address: "0x...",
 *   chain: ethereum,
 *   client: yourThirdwebClient,
 * });
 *
 * <NFT.Provider contract={nftContract} tokenId={0n}>
 *   <Suspense fallback={"Loading media..."}>
 *     <NFT.Media />
 *   </Suspense>
 * </NFT>
 * ```
 *
 * ### Basic stylings
 *
 * You can style NFT.Media with the `style` and `className` props.
 *
 * ```tsx
 * <NFT.Media style={{ borderRadius: "8px" }} className="mx-auto" />
 * ```
 * @nft
 */
export function Media(props: NFTMediaProps) {
  const { contract, tokenId } = useNFTContext();
  const nftQuery = useSuspenseQuery({
    queryKey: [
      "__nft_info_internal__",
      contract.chain.id,
      contract.address,
      tokenId.toString(),
    ],
    queryFn: () => getNFTInfo({ contract, tokenId }),
  });
  const animation_url = nftQuery.data?.metadata.animation_url;
  const image =
    nftQuery.data?.metadata.image || nftQuery.data?.metadata.image_url;

  return (
    <MediaRenderer
      client={contract.client}
      src={animation_url || image}
      poster={image}
      {...props}
    />
  );
}

/**
 * @internal
 */
export async function getNFTInfo(options: NFTProviderProps): Promise<NFT> {
  const nft = await Promise.allSettled([
    getNFT721(options),
    getNFT1155(options),
  ]).then(([possibleNFT721, possibleNFT1155]) => {
    // getNFT extension always return an NFT object
    // so we need to check if the tokenURI exists
    if (
      possibleNFT721.status === "fulfilled" &&
      possibleNFT721.value.tokenURI
    ) {
      return possibleNFT721.value;
    }
    if (
      possibleNFT1155.status === "fulfilled" &&
      possibleNFT1155.value.tokenURI
    ) {
      return possibleNFT1155.value;
    }
    throw new Error("Failed to load NFT metadata");
  });
  return nft;
}
