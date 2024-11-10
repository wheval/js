import { createContext, useContext } from "react";
import type { ThirdwebContract } from "../../../../../contract/contract.js";

/**
 * Props for the <NFT> component
 * @component
 */
export type NFTProviderProps = {
  /**
   * The NFT contract address. Accepts both ERC721 and ERC1155 contracts
   */
  contract: ThirdwebContract;
  /**
   * The tokenId whose info you want to display
   */
  tokenId: bigint;
};

/**
 * @internal
 */
export const NFTProviderContext = /* @__PURE__ */ createContext<
  NFTProviderProps | undefined
>(undefined);

/**
 * @internal
 */
export function useNFTContext() {
  const ctx = useContext(NFTProviderContext);
  if (!ctx) {
    throw new Error(
      "NFTProviderContext not found. Make sure you are using NFT.Media, NFT.Description, etc. inside a <NFT /> component",
    );
  }
  return ctx;
}

/**
 * A React context provider component that supplies NFT-related data to its child components.
 *
 * This component serves as a wrapper around the `NFTProviderContext.Provider` and passes
 * the provided NFT data down to all of its child components through the context API.
 *
 *
 * @component
 * @param {React.PropsWithChildren<NFTProviderProps>} props - The props for the NFT provider
 *
 * @example
 * ```tsx
 * import { getContract } from "thirdweb";
 * import { NFT } from "thirdweb/react";
 *
 * const contract = getContract({
 *   address: "0x...",
 *   chain: ethereum,
 *   client: yourThirdwebClient,
 * });
 *
 * <NFT.Provider contract={contract} tokenId={0n}>
 *   <Suspense fallback={"Loading media..."}>
 *     <NFT.Media />
 *     <NFT.Description />
 *   </Suspense>
 * </NFT>
 * ```
 * @nft
 */
export function Provider(props: React.PropsWithChildren<NFTProviderProps>) {
  return (
    <NFTProviderContext.Provider value={props}>
      {props.children}
    </NFTProviderContext.Provider>
  );
}
