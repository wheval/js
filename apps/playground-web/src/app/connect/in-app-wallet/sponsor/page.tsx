import { CodeExample } from "@/components/code/code-example";
import ThirdwebProvider from "@/components/thirdweb-provider";
import { metadataBase } from "@/lib/constants";
import type { Metadata } from "next";
import { APIHeader } from "../../../../components/blocks/APIHeader";
import { SponsoredInAppTxPreview } from "../../../../components/in-app-wallet/sponsored-tx";

export const metadata: Metadata = {
  metadataBase,
  title: "Sign In, Account Abstraction and SIWE Auth | thirdweb Connect",
  description:
    "Let users sign up with their email, phone number, social media accounts or directly with a wallet. Seamlessly integrate account abstraction and SIWE auth.",
};

export default function Page() {
  return (
    <ThirdwebProvider>
      <main className="pb-20 container px-0">
        <APIHeader
          title="Onboard users to web3"
          description={
            <>
              Onboard anyone with flexible auth options, secure account
              recovery, and smart account integration.
            </>
          }
          docsLink="https://portal.thirdweb.com/connect/in-app-wallet/overview"
          heroLink="/in-app-wallet.png"
        />

        <section className="space-y-8">
          <SponsoredInAppTx />
        </section>

        <div className="h-14" />
      </main>
    </ThirdwebProvider>
  );
}

function SponsoredInAppTx() {
  return (
    <>
      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
          Signless Sponsored Transactions
        </h2>
        <p className="max-w-[600px]">
          With in-app wallets, users don&apos;t need to confirm every
          transaction.
          <br />
          Combine it with smart account flag to cover gas costs for the best UX.
        </p>
      </div>
      <CodeExample
        preview={<SponsoredInAppTxPreview />}
        code={`import { inAppWallet } from "thirdweb/wallets";
  import { claimTo } from "thirdweb/extensions/erc1155";
  import { ConnectButton, TransactionButton } from "thirdweb/react";

  const wallets = [
    inAppWallet(
      // turn on gas sponsorship for in-app wallets
      { smartAccount: { chain, sponsorGas: true }}
    )
  ];

  function App(){
    return (<>
<ConnectButton client={client} wallets={wallets} />

{/* signless, sponsored transactions */}
<TransactionButton transaction={() => claimTo({ contract, to: "0x123...", tokenId: 0n, quantity: 1n })}>Mint</TransactionButton>
</>);
};`}
        lang="tsx"
      />
    </>
  );
}