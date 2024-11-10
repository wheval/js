"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { getNFTInfo } from "./media.js";
import { useNFTContext } from "./provider.js";

/**
 * This component fetches and displays an NFT's description. It takes in a `className` and `style` props
 * so you can style it just like how you would style a <span> element.
 * @returns A <span> element containing the description of the NFT
 *
 * Since this component has an internal loading state (for when the NFT media is being fetched),
 * you must wrap it with React.Suspense to make it work.
 *
 * @component
 * @example
 * ### Basic usage
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
 *   This will show the description for tokenId #0 from the `nftContract` collection
 *   <Suspense fallback={"Loading description..."}>
 *     <NFT.Description className="mx-auto" style={{ color: "red" }} />
 *   </Suspense>
 * </NFT>
 * ```
 * @nft
 */
export function Description(props: {
  className: string;
  style: React.CSSProperties;
}) {
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
  const description = nftQuery.data?.metadata.description || "";
  return <span {...props}>{description}</span>;
}
