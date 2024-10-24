import { WalletAddress } from "@/components/blocks/wallet-address";
import { CopyAddressButton } from "@/components/ui/CopyAddressButton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation } from "@tanstack/react-query";
import { TransactionButton } from "components/buttons/TransactionButton";
import { InfoIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  type ContractOptions,
  getContract,
  sendTransaction,
  waitForReceipt,
} from "thirdweb";
import { uninstallModuleByProxy } from "thirdweb/modules";
import { useActiveAccount } from "thirdweb/react";
import type { Account } from "thirdweb/wallets";
import { useModuleContractInfo } from "./moduleContractInfo";

import { Spinner } from "@/components/ui/Spinner/Spinner";
import { MintableModule } from "./Mintable";
import { TransferableModule } from "./Transferable";

function Module(props: {
  name: string;
  contract: ContractOptions;
  uninstallButton: UninstallButtonProps;
  isOwnerAccount: boolean;
}) {
  if (props.name.includes("Transferable")) {
    return <TransferableModule {...props} />;
  }
  if (props.name.includes("Mintable")) {
    return <MintableModule {...props} />;
  }

  return null;
}

const moduleConfigurationExists = (_moduleName: string) =>
  /(Mintable|Transferable)/;

type ModuleProps = {
  moduleAddress: string;
  contract: ContractOptions;
  onRemoveModule: () => void;
  isOwnerAccount: boolean;
};

export function ModuleCard(props: ModuleProps) {
  const { contract, moduleAddress } = props;
  const [isUninstallModalOpen, setIsUninstallModalOpen] = useState(false);
  const account = useActiveAccount();

  const contractInfo = useModuleContractInfo(
    getContract({
      address: moduleAddress,
      chain: contract.chain,
      client: contract.client,
    }),
  );

  const uninstallMutation = useMutation({
    mutationFn: async (account: Account) => {
      const uninstallTransaction = uninstallModuleByProxy({
        contract,
        chain: contract.chain,
        client: contract.client,
        moduleProxyAddress: moduleAddress,
        moduleData: "0x",
      });

      const txResult = await sendTransaction({
        transaction: uninstallTransaction,
        account,
      });

      await waitForReceipt(txResult);
    },
    onSuccess() {
      toast.success("Module Removed successfully");
      props.onRemoveModule();
    },
    onError(error) {
      toast.error("Failed to remove module");
      console.error("Error during uninstallation:", error);
    },
  });

  const handleRemove = async () => {
    if (!account) {
      toast.error("Wallet is not connected");
      return;
    }

    setIsUninstallModalOpen(false);
    uninstallMutation.mutate(account);
  };

  if (!contractInfo) {
    return <Skeleton className="h-[175px] w-full border border-border" />;
  }

  return (
    <>
      <ModuleCardUI
        isOwnerAccount={props.isOwnerAccount}
        contractInfo={{
          name: contractInfo.name,
          description: contractInfo.description,
          publisher: contractInfo.publisher,
          version: contractInfo.version,
        }}
        moduleAddress={moduleAddress}
      >
        {moduleConfigurationExists(contractInfo.name) ? (
          <Module
            name={contractInfo.name}
            isOwnerAccount={props.isOwnerAccount}
            uninstallButton={{
              onClick: handleRemove,
              isPending: uninstallMutation.isPending,
            }}
            contract={contract}
          />
        ) : (
          <Button
            size="sm"
            onClick={handleRemove}
            variant="destructive"
            className="min-w-24 gap-2"
            disabled={!props.isOwnerAccount}
          >
            {uninstallMutation.isPending && <Spinner className="size-4" />}
            Uninstall
          </Button>
        )}
      </ModuleCardUI>

      <Dialog
        open={isUninstallModalOpen}
        onOpenChange={setIsUninstallModalOpen}
      >
        <DialogContent className="z-[10001]" dialogOverlayClassName="z-[10000]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleRemove();
            }}
          >
            <DialogHeader>
              <DialogTitle>Uninstall Module</DialogTitle>
              <DialogDescription>
                Are you sure you want to uninstall{" "}
                <span className="font-medium text-foreground ">
                  {contractInfo.name}
                </span>{" "}
                ?
              </DialogDescription>
            </DialogHeader>

            <DialogFooter className="mt-10 flex-row justify-end gap-3 md:gap-1">
              <Button
                type="button"
                onClick={() => setIsUninstallModalOpen(false)}
                variant="outline"
              >
                Cancel
              </Button>

              <TransactionButton
                txChainID={contract.chain.id}
                transactionCount={1}
                isLoading={uninstallMutation.isPending}
                type="submit"
                colorScheme="red"
                className="flex"
              >
                Uninstall
              </TransactionButton>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

export type UninstallButtonProps = {
  onClick: () => Promise<void>;
  isPending: boolean;
};

export type ModuleCardUIProps = {
  children: React.ReactNode;
  contractInfo: {
    name: string;
    description?: string;
    version?: string;
    publisher?: string;
  };
  moduleAddress: string;
  isOwnerAccount: boolean;
};

export function ModuleCardUI(props: ModuleCardUIProps) {
  return (
    <section className="rounded-lg border border-border bg-muted/50">
      {/* Header */}
      <div className="relative p-4 lg:p-6">
        {/* Title */}
        <div className="pr-14">
          <h3 className="mb-1 gap-2 font-semibold text-xl tracking-tight">
            {props.contractInfo.name}

            {/* Info Dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  className="absolute top-4 right-4 h-auto w-auto p-2 text-muted-foreground"
                >
                  <InfoIcon className="size-5" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{props.contractInfo.name}</DialogTitle>
                  <DialogDescription>
                    {props.contractInfo.description}
                  </DialogDescription>

                  {/* Avoid adding focus on other elements to prevent tooltips from opening on modal open */}
                  <input className="sr-only" aria-hidden />

                  <div className="h-2" />

                  <div className="flex flex-col gap-4">
                    {props.contractInfo.version && (
                      <div>
                        <p className="text-muted-foreground text-sm">
                          {" "}
                          Version{" "}
                        </p>
                        <p> {props.contractInfo.version}</p>
                      </div>
                    )}

                    {props.contractInfo.publisher && (
                      <div>
                        <p className="text-muted-foreground text-sm">
                          Published By
                        </p>
                        <WalletAddress address={props.contractInfo.publisher} />
                      </div>
                    )}

                    <div>
                      <p className="mb-1 text-muted-foreground text-sm">
                        Module Address
                      </p>
                      <CopyAddressButton
                        className="text-xs"
                        address={props.moduleAddress}
                        copyIconPosition="left"
                        variant="outline"
                      />
                    </div>
                  </div>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </h3>

          {/* Description */}
          <p className="text-muted-foreground">
            {props.contractInfo.description}
          </p>
        </div>

        <div className="h-5" />

        {props.children}
      </div>
    </section>
  );
}
