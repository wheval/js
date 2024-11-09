import { Flex } from "@chakra-ui/react";
import type { AbiParameter } from "abitype";
import { Heading, Text } from "tw-components";
import { RefContractInput } from "./ref-input";

interface RefContractFieldsetProps {
  param: AbiParameter;
}

export const RefContractsFieldset: React.FC<RefContractFieldsetProps> = ({
  param,
}) => {
  return (
    <Flex gap={8} direction="column" as="fieldset">
      <Flex gap={2} direction="column">
        <Heading size="title.md">Ref Contract settings</Heading>
        <Text>You can set contract to reference for this address value.</Text>
      </Flex>
      <Flex flexDir="column" gap={4}>
        <RefContractInput param={param} />
      </Flex>
    </Flex>
  );
};
