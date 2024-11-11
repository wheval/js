import {
  Divider,
  Flex,
  FormControl,
  Input,
  Select,
  Skeleton,
} from "@chakra-ui/react";
import type { AbiParameter } from "abitype";
import { useFormContext } from "react-hook-form";
import { FormLabel } from "tw-components";
import { useAllVersions, usePublishedContractsQuery } from "../hooks";

interface RefContractImplInputProps {
  param: AbiParameter;
}

export const RefContractImplInput: React.FC<RefContractImplInputProps> = ({
  param,
}) => {
  const form = useFormContext();

  const publishedContractsQuery = usePublishedContractsQuery(
    form.watch(
      `implConstructorParams.${param.name ? param.name : "*"}.ref.publisherAddress`,
    ),
  );

  const allVersions = useAllVersions(
    form.watch(
      `implConstructorParams.${param.name ? param.name : "*"}.ref.publisherAddress`,
    ),
    form.watch(
      `implConstructorParams.${param.name ? param.name : "*"}.ref.contractId`,
    ),
  );

  return (
    <Flex flexDir="column" gap={2}>
      <Flex
        w="full"
        gap={{ base: 4, md: 2 }}
        flexDir={{ base: "column", md: "row" }}
      >
        <FormControl
          as={Flex}
          flexDir="column"
          gap={1}
          isInvalid={
            !!form.getFieldState(
              `implConstructorParams.${param.name ? param.name : "*"}.ref.publisherAddress`,
              form.formState,
            ).error
          }
        >
          <FormLabel textTransform="capitalize">Publisher</FormLabel>
          <Input
            placeholder="Address or ENS"
            {...form.register(
              `implConstructorParams.${param.name ? param.name : "*"}.ref.publisherAddress`,
            )}
          />
        </FormControl>
        <FormControl as={Flex} flexDir="column" gap={1}>
          <FormLabel textTransform="capitalize">Contract Name</FormLabel>
          <Skeleton
            isLoaded={
              !!publishedContractsQuery.data ||
              !publishedContractsQuery.isFetching
            }
            borderRadius="lg"
          >
            <Select
              isDisabled={(publishedContractsQuery?.data || []).length === 0}
              {...form.register(
                `implConstructorParams.${param.name ? param.name : "*"}.ref.contractId`,
              )}
              placeholder={
                publishedContractsQuery.isFetched &&
                (publishedContractsQuery?.data || []).length === 0
                  ? "No extensions found"
                  : "Select extension"
              }
            >
              {publishedContractsQuery?.data?.map(({ contractId }) => (
                <option key={contractId} value={contractId}>
                  {contractId}
                </option>
              ))}
            </Select>
          </Skeleton>
        </FormControl>

        <FormControl as={Flex} flexDir="column" gap={1}>
          <FormLabel textTransform="capitalize">Contract Version</FormLabel>
          <Skeleton
            isLoaded={!!allVersions.data || !allVersions.isFetching}
            borderRadius="lg"
          >
            <Select
              w="full"
              isDisabled={!allVersions.data}
              {...form.register(
                `implConstructorParams.${param.name ? param.name : "*"}.ref.version`,
              )}
              borderRadius="lg"
            >
              <option value="">Always latest</option>
              {allVersions?.data?.map(({ version }) => (
                <option key={version} value={version}>
                  {version}
                </option>
              ))}
            </Select>
          </Skeleton>
        </FormControl>
      </Flex>
      <Divider />
    </Flex>
  );
};
