import { Book, BookIcon, CodeIcon, ExternalLink, ZapIcon } from "lucide-react";
import type { SideBar } from "../../../components/Layouts/DocLayout";
import { TypeScriptIcon } from "../../../icons";

const slug = "/react/v5";

export const sidebar: SideBar = {
  name: "Connect React SDK",
  links: [
    {
      separator: true,
    },
    {
      name: "Overview",
      href: slug,
    },
    {
      name: "Getting Started",
      href: `${slug}/getting-started`,
      icon: <ZapIcon />,
    },
    {
      name: "Live Playground",
      href: "https://playground.thirdweb.com/",
      icon: <ExternalLink />,
    },
    {
      name: "API Reference",
      href: "/references/typescript/v5",
      isCollapsible: false,
      icon: <CodeIcon />,
    },
    {
      separator: true,
    },
    {
      name: "Onboarding Users",
      isCollapsible: false,
      links: [
        {
          name: "Connect Wallets",
          links: [
            {
              name: "UI Components",
              href: `${slug}/connecting-wallets/ui-components`,
              icon: <Book />,
            },
            {
              name: "Custom UI",
              href: `${slug}/connecting-wallets/hooks`,
              icon: <Book />,
            },
            {
              name: "Supported Wallets",
              href: "/typescript/v5/supported-wallets",
              icon: <TypeScriptIcon />,
            },
          ],
        },
        {
          name: "Create Wallets",
          links: [
            {
              name: "Social Auth",
              href: `${slug}/in-app-wallet/get-started`,
              icon: <ZapIcon />,
            },
            {
              name: "Ecosystems",
              href: `${slug}/ecosystem-wallet/get-started`,
              icon: <ZapIcon />,
            },
            {
              name: "Sponsor Transactions",
              href: `${slug}/in-app-wallet/enable-gasless`,
              icon: <BookIcon />,
            },
            {
              name: "Custom UI",
              href: `${slug}/in-app-wallet/build-your-own-ui`,
              icon: <BookIcon />,
            },
            {
              name: "Export Private Key",
              href: `${slug}/in-app-wallet/export-private-key`,
              icon: <BookIcon />,
            },
          ],
        },
        {
          name: "Account Abstraction",
          links: [
            {
              name: "Smart Accounts",
              href: `${slug}/account-abstraction/get-started`,
              icon: <Book />,
            },
            {
              name: "Custom UI",
              href: `${slug}/account-abstraction/build-your-own-ui`,
              icon: <Book />,
            },
            {
              name: "Batching Transactions",
              href: `${slug}/account-abstraction/batching-transactions`,
              icon: <Book />,
            },
          ],
        },
        {
          name: "Funding wallets",
          links: [
            {
              name: "UI Components",
              href: `${slug}/PayEmbed`, // TODO
            },
            {
              name: "Buy with Crypto",
              href: `${slug}/PayEmbed`, // TODO
            },
            {
              name: "Buy with Fiat",
              href: `${slug}/PayEmbed`, // TODO
            },
          ],
        },
      ],
    },
    {
      separator: true,
    },
    {
      name: "User Identity",
      isCollapsible: false,
      links: [
        {
          name: "Sign in with Ethereum",
          links: [
            {
              name: "UI component",
              href: `${slug}/auth`, // TODO
            },
            {
              name: "Custom UI",
              href: `${slug}/auth/headless`, // TODO
            },
          ],
        },
        {
          name: "Link Identities",
          links: [
            {
              name: "UI component",
              href: `${slug}/linking`, // TODO
            },
            {
              name: "Custom UI",
              href: `${slug}/linking/headless`, // TODO
            },
          ],
        },
        {
          name: "Web3 Social Profiles",
          href: `${slug}/social-profiles/headless`, // TODO
        },
        {
          name: "Admins & Session Keys",
          href: `${slug}/account-abstraction/permissions`,
        },
      ],
    },
    {
      separator: true,
    },
    {
      name: "Onchain Interactions",
      isCollapsible: false,
      links: [
        {
          name: "UI Components",
          links: ["ClaimButton", "TransactionButton", "NFT"].map((name) => ({
            name,
            href: `${slug}/${name}`,
            icon: <CodeIcon />,
          })),
        },
        {
          name: "Reading State",
          href: `${slug}/reading-state`,
        },
        {
          name: "Transactions",
          href: `${slug}/transactions`,
        },
        {
          name: "Extensions",
          href: `${slug}/extensions`,
        },
      ],
    },
    { separator: true },
    {
      name: "Advanced",
      isCollapsible: false,
      links: [
        {
          name: "Adapters",
          links: [
            {
              // TODO one guide per library
              name: "Usage with other libraries",
              icon: <Book />,
              href: `${slug}/adapters`,
            },
          ],
        },
        {
          name: "Auto connect",
          links: ["SiteEmbed", "SiteLink"].map((name) => ({
            name,
            href: `${slug}/${name}`,
            icon: <CodeIcon />,
          })),
        },
      ],
    },
    { separator: true },
    {
      name: "Migrate from v4",
      href: `${slug}/migrate`,
      links: [
        {
          name: "Installation",
          href: `${slug}/migrate/installation`,
        },
        {
          name: "Interacting with contracts",
          href: `${slug}/migrate/contracts`,
        },
        {
          name: "ethers.js Adapter",
          href: `${slug}/migrate/ethers-adapter`,
        },
        {
          name: "Cheatsheet",
          href: `${slug}/migrate/cheatsheet`,
        },
      ],
    },
    {
      name: "Migrate from RainbowKit",
      href: `${slug}/rainbow-kit-migrate`,
    },
  ],
};
