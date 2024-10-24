import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type ContractOptions, waitForReceipt } from "thirdweb";
import { MintableERC721 } from "thirdweb/modules";
import {
  useActiveAccount,
  useReadContract,
  useSendTransaction,
} from "thirdweb/react";
import { z } from "zod";
import type { UninstallButtonProps } from "./module-card";

const formSchema = z.object({
  primarySaleRecipient: z.string(),
});

export type MintableModuleFormValues = z.infer<typeof formSchema>;

export function MintableModule(props: {
  contract: ContractOptions;
  uninstallButton: UninstallButtonProps;
  isOwnerAccount: boolean;
}) {
  const { contract } = props;
  const account = useActiveAccount();
  const { mutateAsync: sendTransaction } = useSendTransaction();
  const { data: primarySaleRecipient, isLoading } = useReadContract(
    MintableERC721.getSaleConfig,
    {
      contract,
    },
  );

  async function update(values: MintableModuleFormValues) {
    // isRestricted is the opposite of transferEnabled
    const setSaleConfigTransaction = MintableERC721.setSaleConfig({
      contract,
      primarySaleRecipient: values.primarySaleRecipient,
    });

    const setSaleConfigTxResult = await sendTransaction(
      setSaleConfigTransaction,
    );

    try {
      await waitForReceipt(setSaleConfigTxResult);
      toast.success("Successfully updated primary sale recipient");
    } catch (_) {
      toast.error("Failed to update the primary sale recipient");
    }
  }

  return (
    <MintableModuleUI
      isPending={isLoading}
      primarySaleRecipient={primarySaleRecipient || ""}
      adminAddress={account?.address || ""}
      update={update}
      {...props}
    />
  );
}

export function MintableModuleUI(props: {
  primarySaleRecipient: string;
  isPending: boolean;
  adminAddress: string;
  isOwnerAccount: boolean;
  update: (values: MintableModuleFormValues) => Promise<void>;
  uninstallButton: UninstallButtonProps;
}) {
  const form = useForm<MintableModuleFormValues>({
    resolver: zodResolver(formSchema),
    values: {
      primarySaleRecipient: props.primarySaleRecipient,
    },
    reValidateMode: "onChange",
  });

  const updateMutation = useMutation({
    mutationFn: props.update,
  });

  const onSubmit = async () => {
    const _values = form.getValues();
    const values = { ..._values };

    await updateMutation.mutateAsync(values);
  };

  if (props.isPending) {
    return <Skeleton className="h-36" />;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex gap-4">
          {/* Switch */}
          <FormField
            control={form.control}
            name="primarySaleRecipient"
            render={({ field }) => (
              <FormItem className="flex flex-1 flex-col gap-3">
                <FormLabel>Primary Sale Recipient</FormLabel>
                <FormControl>
                  <Input
                    placeholder="0x..."
                    {...field}
                    disabled={!props.isOwnerAccount}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="h-3" />

        <div className="flex flex-row justify-end gap-3 border-border border-t py-4">
          <Button
            size="sm"
            onClick={props.uninstallButton.onClick}
            variant="destructive"
            className="min-w-24 gap-2"
            disabled={!props.isOwnerAccount}
          >
            {props.uninstallButton.isPending && <Spinner className="size-4" />}
            Uninstall
          </Button>

          {props.isOwnerAccount && (
            <Button
              size="sm"
              className="min-w-24 gap-2"
              type="submit"
              disabled={
                props.isPending ||
                !props.isOwnerAccount ||
                !form.formState.isDirty ||
                updateMutation.isPending
              }
            >
              {updateMutation.isPending && <Spinner className="size-4" />}
              Update
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
