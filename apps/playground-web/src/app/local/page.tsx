"use client";

import { Button } from "@/components/ui/button";
import { THIRDWEB_CLIENT } from "@/lib/client";
import { Suspense } from "react";
import { sepolia } from "thirdweb/chains";
import { Account, Blobbie, ThirdwebProvider } from "thirdweb/react";
import { shortenAddress } from "thirdweb/utils";

export default function Page() {
  return (
    <ThirdwebProvider>
      <div className="flex h-full w-full flex-col items-center gap-3">
        <div>
          <div>Let&apos;s rebuild a basic ConnectButton-details component</div>
          <BasicConnectedButton />
        </div>
      </div>
    </ThirdwebProvider>
  );
}

const BasicConnectedButton = () => {
  const roundUpBalance = (num: number) => Math.round(num * 10) / 10;
  return (
    <Account
      address="0x12345674b599ce99958242b3D3741e7b01841DF3"
      client={THIRDWEB_CLIENT}
    >
      <Button className="flex h-12 w-40 flex-row justify-start gap-3 px-2">
        <Suspense
          fallback={
            <Blobbie
              address="0x12345674b599ce99958242b3D3741e7b01841DF3"
              className="h-10 w-10 rounded-full"
            />
          }
        >
          <Account.Avatar className="h-10 w-10 rounded-full" />
        </Suspense>
        <div className="flex flex-col items-start">
          <Suspense fallback={<Account.Address formatFn={shortenAddress} />}>
            <Account.Name />
          </Suspense>
          <Suspense fallback={"skeleton"}>
            <Account.Balance chain={sepolia} formatFn={roundUpBalance} />
          </Suspense>
        </div>
      </Button>
    </Account>
  );
};
