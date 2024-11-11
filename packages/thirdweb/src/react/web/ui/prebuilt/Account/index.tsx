"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import type { Address } from "abitype";
import type React from "react";
import { createContext, useContext } from "react";
import type { Chain } from "../../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../../client/client.js";
import { resolveAvatar } from "../../../../../extensions/ens/resolve-avatar.js";
import {
  type ResolveNameOptions,
  resolveName,
} from "../../../../../extensions/ens/resolve-name.js";
import { getSocialProfiles } from "../../../../../social/profiles.js";
import type { SocialProfile } from "../../../../../social/types.js";
import { parseAvatarRecord } from "../../../../../utils/ens/avatar.js";
import { getWalletBalance } from "../../../../../wallets/utils/getWalletBalance.js";

type AccountProps = {
  address: Address;
  client: ThirdwebClient;
};

const AccountProviderContext = /* @__PURE__ */ createContext<
  AccountProps | undefined
>(undefined);

export function Account(props: React.PropsWithChildren<AccountProps>) {
  return (
    <AccountProviderContext.Provider value={props}>
      {props.children}
    </AccountProviderContext.Provider>
  );
}

/**
 * @internal
 */
function useAccountContext() {
  const ctx = useContext(AccountProviderContext);
  if (!ctx) {
    throw new Error(
      "AccountProviderContext not found. Make sure you are using Account.Name, Account.Avatar, etc. inside an <Account /> component",
    );
  }
  return ctx;
}

interface AccountBalanceProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
  chain?: Chain;
  tokenAddress?: string;
  /**
   * A function to format the balance's display value
   */
  formatFn?: (num: number) => number;
}

/**
 *
 * ### Basic usage
 * ```tsx
 * import { Account } from "thirdweb/react";
 *
 * <Account address="0x...">
 *   <Account.Balance />
 * </Account>
 * ```
 * Result:
 * ```html
 * <span>1.091435 ETH</span>
 * ```
 *
 *
 * ### Format the balance (round up, shorten etc.)
 * The Account.Balance component accepts a `formatFn` which takes in a number and output a number
 * The function is used to modify the display value of the wallet balance
 *
 * ```tsx
 * const roundTo1Decimal(num: number):number => Math.round(num * 10) / 10;
 *
 * <Account.Balance formatFn={roundTo1Decimal} />
 * ```
 *
 * Result:
 * ```html
 * <span>1.1 ETH</span>
 * ```
 */
Account.Balance = ({
  chain,
  tokenAddress,
  formatFn,
  ...restProps
}: AccountBalanceProps) => {
  const { address, client } = useAccountContext();
  const balanceQuery = useSuspenseQuery({
    queryKey: [
      "walletBalance",
      chain?.id || -1,
      address || "0x0",
      { tokenAddress },
    ] as const,
    queryFn: async () => {
      if (!chain) {
        throw new Error("chain is required");
      }
      if (!client) {
        throw new Error("client is required");
      }
      return getWalletBalance({
        chain,
        client,
        address,
        tokenAddress,
      });
    },
  });

  const displayValue = balanceQuery.data
    ? formatFn
      ? formatFn(Number(balanceQuery.data.displayValue))
      : balanceQuery.data.displayValue
    : "";

  return (
    <span {...restProps}>
      {displayValue} {balanceQuery.data?.symbol}
    </span>
  );
};

interface AccountAddressProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
  formatFn?: (str: string) => string;
}

/**
 *
 * @returns a <span> containing the full wallet address of the account
 *
 * @example
 * ### Basic usage
 * ```tsx
 * import { Account } from "thirdweb/react";
 *
 * <Account address="0x12345674b599ce99958242b3D3741e7b01841DF3" client={TW_CLIENT}>
 *   <Account.Address />
 * </Account>
 * ```
 * Result:
 * ```html
 * <span>0x12345674b599ce99958242b3D3741e7b01841DF3</span>
 * ```
 *
 *
 * ### Shorten the address
 * ```tsx
 * import { Account } from "thirdweb/react";
 * import { shortenAddress } from "thirdweb/utils";
 *
 * <Account address="0x12345674b599ce99958242b3D3741e7b01841DF3" client={TW_CLIENT}>
 *   <Account.Address formatFn={shortenAddress} />
 * </Account>
 * ```
 * Result:
 * ```html
 * <span>0x1234...1DF3</span>
 * ```
 *
 */
Account.Address = ({ formatFn, ...restProps }: AccountAddressProps) => {
  const { address } = useAccountContext();
  const value = formatFn ? formatFn(address) : address;
  return <span {...restProps}>{value}</span>;
};

interface AccountAvatar
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src">,
    Omit<ResolveNameOptions, "client" | "address"> {
  /**
   * Use this prop to prioritize the social profile that you want to display
   * This is useful for a wallet containing multiple social profiles
   */
  socialType?: SocialProfile["type"];
}

Account.Avatar = ({
  socialType,
  resolverAddress,
  resolverChain,
  ...restProps
}: AccountAvatar) => {
  const { address, client } = useAccountContext();
  const avatarQuery = useSuspenseQuery({
    queryKey: ["account-avatar", address],
    queryFn: async () => {
      const [socialData, ensName] = await Promise.all([
        getSocialProfiles({ address, client }),
        resolveName({
          client,
          address: address || "",
          resolverAddress,
          resolverChain,
        }),
      ]);

      const uri = socialData?.filter(
        (p) => p.avatar && (socialType ? p.type === socialType : true),
      )[0]?.avatar;

      const [resolvedSocialAvatar, resolvedENSAvatar] = await Promise.all([
        uri ? parseAvatarRecord({ client, uri }) : undefined,
        ensName
          ? resolveAvatar({
              client,
              name: ensName,
            })
          : undefined,
      ]);

      // If no social image + ens name found -> exit and show <Blobbie />
      if (!resolvedSocialAvatar && !resolvedENSAvatar) {
        throw new Error("Failed to resolve social + ens avatar");
      }

      // else, prioritize the social image first
      if (resolvedSocialAvatar) {
        return resolvedSocialAvatar;
      }

      if (resolvedENSAvatar) {
        return resolvedENSAvatar;
      }

      throw new Error("Failed to resolve social + ens avatar");
    },
  });
  return <img src={avatarQuery.data} {...restProps} alt="" />;
};

interface AccountName
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children">,
    Omit<ResolveNameOptions, "client" | "address"> {
  formatFn?: (str: string) => string;
  /**
   * Use this prop to prioritize the social profile that you want to display
   * This is useful for a wallet containing multiple social profiles
   */
  socialType?: SocialProfile["type"];
}

/**
 *
 * @param props
 * @returns A `<span>` containing the name of the account
 * ```html
 * <span>{name}</span>
 * ```
 *
 * @example
 * ### Show a shortened address if social name & ENS name weren't found
 * ```tsx
 * import { isAddress, shortenAddress } from "thirdweb/utils";
 * import { Account } from "thirdweb/react";
 *
 * const showShortAddress = (name: string) => {
 *   if (isAddress(name)) {
 *     shortenAddress(name);
 *   }
 *   return name;
 * }
 *
 * return <Account.Name formatFn={showShortAddress} />
 * ```
 */
Account.Name = ({
  resolverAddress,
  resolverChain,
  socialType,
  formatFn,
  ...restProps
}: AccountName) => {
  const { address, client } = useAccountContext();
  const nameQuery = useSuspenseQuery({
    queryKey: ["account-name", address],
    queryFn: async () => {
      const [socialData, ensName] = await Promise.all([
        getSocialProfiles({ address, client }),
        resolveName({
          client,
          address,
          resolverAddress,
          resolverChain,
        }),
      ]);

      const name =
        socialData?.filter(
          (p) => p.name && (socialType ? p.type === socialType : true),
        )[0]?.name ||
        ensName ||
        address;

      return formatFn ? formatFn(name) : name;
    },
    retry: 3,
  });
  return <span {...restProps}>{nameQuery.data}</span>;
};
